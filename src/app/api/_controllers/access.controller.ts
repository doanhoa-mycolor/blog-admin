import { COOKIE_NAMES } from "@/lib/cookies";
import { signJwt, verifyJwt } from "@/lib/jwt";
import { type NextRequest, NextResponse } from "next/server";
import ErrorResponse, {
	BadRequestError,
	UnauthorizedError,
} from "../_core/error.response";
import SuccessResponse from "../_core/success.response";
import AccessService from "../_services/access.service";

export class AccessController {
	// Login
	static async login(req: NextRequest) {
		try {
			console.log("[Login] Start login process");
			const { username, password } = await req.json();

			if (!username || !password) {
				console.log("[Login] Missing username or password");
				return new BadRequestError("Username and password are required").send();
			}

			// Call AccessService to handle login
			console.log("[Login] Validating credentials for:", username);
			const userData = await AccessService.login({ username, password });
			console.log("[Login] Login successful for user ID:", userData.id);

			// Create JWT token with jose
			const token = await signJwt(
				{
					userId: userData.id,
					role: userData.role,
				},
				"24h",
			);
			console.log("[Login] JWT token created successfully");

			// Create response with cookie
			const response = NextResponse.json({
				success: true,
				code: 200,
				message: "Login successful",
				data: {
					...userData,
					// Do not return token in response data since using HttpOnly cookie
				},
			});

			// Set all cookies as HttpOnly for security
			console.log(
				"[Login] Setting HttpOnly cookies. User ID:",
				userData.id,
				"Role:",
				userData.role,
			);

			// Cookie contains JWT token - HttpOnly for security
			response.cookies.set({
				name: COOKIE_NAMES.AUTH_TOKEN,
				value: token,
				maxAge: 60 * 60 * 24, // 1 day
				path: "/",
				secure: process.env.NODE_ENV === "production",
				httpOnly: true,
				sameSite: "lax",
			});

			// Cookie contains userId - also set as HttpOnly
			response.cookies.set({
				name: COOKIE_NAMES.USER_ID,
				value: userData.id.toString(),
				maxAge: 60 * 60 * 24, // 1 day
				path: "/",
				secure: process.env.NODE_ENV === "production",
				httpOnly: true,
				sameSite: "lax",
			});

			// Cookie contains role - also set as HttpOnly
			response.cookies.set({
				name: COOKIE_NAMES.USER_ROLE,
				value: userData.role,
				maxAge: 60 * 60 * 24, // 1 day
				path: "/",
				secure: process.env.NODE_ENV === "production",
				httpOnly: true,
				sameSite: "lax",
			});

			console.log("[Login] HttpOnly cookies set successfully");
			return response;
		} catch (error: any) {
			console.error("[Login] Login error:", error);

			// Check error type to return appropriate response
			if (
				error.message.includes("not exist") ||
				error.message.includes("incorrect")
			) {
				return ErrorResponse.Unauthorized(error.message);
			} else if (error.message.includes("locked")) {
				return ErrorResponse.Forbidden(error.message);
			}

			return ErrorResponse.InternalServerError(error.message || "Login error");
		}
	}

	// Logout
	static async logout(req: NextRequest) {
		try {
			const { userId } = await req.json();

			if (!userId) {
				return new BadRequestError("User ID is required").send();
			}

			// Convert userId from string to number
			const userIdAsNumber = Number.parseInt(userId, 10);

			if (isNaN(userIdAsNumber)) {
				return new BadRequestError("Invalid user ID format").send();
			}

			// Call AccessService to handle logout with converted userId
			await AccessService.logout(userIdAsNumber);

			// Create response and delete cookies
			const response = NextResponse.json({
				success: true,
				code: 200,
				message: "Logout successful",
			});

			// Delete all cookies
			response.cookies.delete(COOKIE_NAMES.AUTH_TOKEN);
			response.cookies.delete(COOKIE_NAMES.USER_ID);
			response.cookies.delete(COOKIE_NAMES.USER_ROLE);

			return response;
		} catch (error: any) {
			console.error("[Logout] Logout error:", error);
			return ErrorResponse.InternalServerError(error.message || "Logout error");
		}
	}

	// Check status - new endpoint to check authentication status
	static async checkStatus(req: NextRequest) {
		try {
			// Get token from cookie
			const tokenFromCookie = req.cookies.get(COOKIE_NAMES.AUTH_TOKEN)?.value;
			const userIdFromCookie = req.cookies.get(COOKIE_NAMES.USER_ID)?.value;
			const roleFromCookie = req.cookies.get(COOKIE_NAMES.USER_ROLE)?.value;

			if (!tokenFromCookie || !userIdFromCookie || !roleFromCookie) {
				return NextResponse.json({
					success: false,
					code: 401,
					message: "Not authenticated",
					data: { authenticated: false },
				});
			}

			// Verify token
			const verifyResult = await verifyJwt(tokenFromCookie);

			if (!verifyResult.success) {
				return NextResponse.json({
					success: false,
					code: 401,
					message: "Authentication token invalid or expired",
					data: { authenticated: false },
				});
			}

			return NextResponse.json({
				success: true,
				code: 200,
				message: "Authenticated",
				data: {
					authenticated: true,
					userId: Number.parseInt(userIdFromCookie, 10),
					role: roleFromCookie,
				},
			});
		} catch (error: any) {
			console.error("Auth check error:", error);
			return ErrorResponse.InternalServerError(
				error.message || "Auth check error",
			);
		}
	}

	// Check permission
	static async checkPermission(req: NextRequest) {
		try {
			// Get role from cookie instead of request body
			const roleFromCookie = req.cookies.get(COOKIE_NAMES.USER_ROLE)?.value;

			if (!roleFromCookie) {
				return new BadRequestError("Role not found in session").send();
			}

			// Call AccessService to check permissions
			const permissions = await AccessService.checkPermission(roleFromCookie);

			return SuccessResponse.OK(
				"Permissions retrieved successfully",
				permissions,
			);
		} catch (error: any) {
			console.error("Permission check error:", error);
			return ErrorResponse.InternalServerError(
				error.message || "Permission check error",
			);
		}
	}
}
