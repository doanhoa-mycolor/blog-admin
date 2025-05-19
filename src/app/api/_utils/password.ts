import crypto from "crypto";

/**
 * Hash password using SHA-256
 * @param password Password to hash
 * @returns Hashed password string
 */
export const hashPassword = (password: string): string => {
	return crypto.createHash("sha256").update(password).digest("hex");
};

/**
 * Compare input password with hashed password
 * @param inputPassword Input password
 * @param hashedPassword Hashed password
 * @returns true if match, false otherwise
 */
export const comparePassword = (
	inputPassword: string,
	hashedPassword: string,
): boolean => {
	const hashedInput = hashPassword(inputPassword);
	return hashedInput === hashedPassword;
};
