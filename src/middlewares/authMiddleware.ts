import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_NAMES } from "../lib/cookies";
import { verifyJwt } from "../lib/jwt";

/**
 * Middleware to verify JWT token
 */
export async function verifyAuth(request: NextRequest) {
	// Thử lấy token từ cookie trước
	const tokenFromCookie = request.cookies.get(COOKIE_NAMES.AUTH_TOKEN)?.value;
	const roleFromCookie = request.cookies.get(COOKIE_NAMES.USER_ROLE)?.value;

	// Nếu không có token trong cookie, thử lấy từ header
	let token = tokenFromCookie;
	if (!token) {
		const authHeader = request.headers.get("Authorization");
		if (authHeader && authHeader.startsWith("Bearer ")) {
			token = authHeader.split(" ")[1];
		}
	}

	if (!token) {
		return {
			success: false,
			error: "Missing authentication token",
		};
	}

	try {
		// Xác thực token sử dụng jose
		const jwtResult = await verifyJwt(token);

		if (!jwtResult.success || !jwtResult.payload) {
			return {
				success: false,
				error: jwtResult.error || "Invalid token",
			};
		}

		// Đảm bảo payload có userId và role
		const userId = jwtResult.payload.userId;
		// Lấy role từ payload hoặc từ cookie
		const role = jwtResult.payload.role || roleFromCookie;

		if (!userId || !role) {
			return {
				success: false,
				error: "Invalid token payload",
			};
		}

		return {
			success: true,
			userId: userId as number,
			role: role as string,
		};
	} catch (error) {
		console.error("JWT Verification failed:", error);
		return {
			success: false,
			error: "Invalid token",
		};
	}
}

/**
 * Middleware for checking resource-specific permissions
 */
export function checkResourcePermission(
	role: string,
	resource: string,
	action: "list" | "create" | "edit" | "show" | "delete",
) {
	// Admin has full access
	if (role === "ADMIN") {
		return true;
	}

	// Editor can do everything except managing users
	if (role === "EDITOR") {
		if (resource === "users" && action !== "list" && action !== "show") {
			return false;
		}
		return true;
	}

	// Viewer can only view (list, show) and create comments
	if (role === "VIEWER") {
		if (action === "list" || action === "show") {
			return true;
		}

		if (resource === "comments" && action === "create") {
			return true;
		}

		return false;
	}

	return false;
}
