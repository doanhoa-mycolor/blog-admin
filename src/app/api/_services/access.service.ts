import crypto from "crypto";
import { generatePermissions } from "../_auth/authUtils";
import { comparePassword, hashPassword } from "../_utils/password";
import keyTokenService from "./keyToken.service";
import userService from "./user.service";

class AccessService {
	/**
	 * User login
	 */
	static login = async ({
		username,
		password,
	}: {
		username: string;
		password: string;
	}) => {
		// Find user by username
		const foundUser = await userService.findByUsername({
			username,
		});

		if (!foundUser) {
			throw new Error("User does not exist");
		}

		if (!foundUser.enabled) {
			throw new Error("Account is locked");
		}

		if (foundUser.isDeleted) {
			throw new Error("Account does not exist");
		}

		// Check password
		const matchPassword = comparePassword(password, foundUser.password);

		if (!matchPassword) {
			throw new Error("Incorrect login credentials");
		}

		// Create user data with permissions
		const userData = {
			id: foundUser.id,
			username: foundUser.username,
			name: foundUser.name,
			email: foundUser.email,
			role: foundUser.role,
			permissions: generatePermissions(foundUser.role),
		};

		return userData;
	};

	/**
	 * User logout
	 */
	static logout = async (userId: number) => {
		if (!userId) return null;

		try {
			// Delete token
			return await keyTokenService.removeTokenByUserId(userId);
		} catch (error) {
			console.error("Logout error:", error);
			return null;
		}
	};

	/**
	 * Check permissions by role
	 */
	static checkPermission = async (role: string) => {
		if (!role) {
			throw new Error("Role cannot be empty");
		}

		// Generate permissions from role
		const permissions = generatePermissions(role);

		return permissions;
	};
}

export default AccessService;
