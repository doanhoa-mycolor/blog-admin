import { SignJWT, jwtVerify } from "jose";

/**
 * Create secret key for JWT
 */
const getJwtSecretKey = () => {
	const secret = process.env.JWT_SECRET || "blog-admin-secret";
	return new TextEncoder().encode(secret);
};

/**
 * Create JWT token
 */
export async function signJwt(payload: any, expiresIn = "24h") {
	const secretKey = getJwtSecretKey();

	// Convert expiresIn string to seconds
	let expirationTime = 86400; // Default: 24 hours
	if (typeof expiresIn === "string") {
		const unit = expiresIn.slice(-1);
		const value = Number.parseInt(expiresIn);

		if (unit === "s") expirationTime = value;
		else if (unit === "m") expirationTime = value * 60;
		else if (unit === "h") expirationTime = value * 60 * 60;
		else if (unit === "d") expirationTime = value * 60 * 60 * 24;
	}

	const token = await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(Math.floor(Date.now() / 1000) + expirationTime)
		.sign(secretKey);

	return token;
}

/**
 * Verify JWT token
 */
export async function verifyJwt(token: string) {
	try {
		const secretKey = getJwtSecretKey();
		const { payload } = await jwtVerify(token, secretKey);

		return {
			success: true,
			payload,
		};
	} catch (error) {
		console.error("JWT verification error:", error);
		return {
			success: false,
			error: "Invalid token",
		};
	}
}
