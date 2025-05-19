// Encode userID
import { generateRole } from "@/views/_core/permissions";

export const encodeUserId = (id: number): string => {
	return Buffer.from(`${id}`).toString("base64");
};

// Decode userID
export const decodeUserId = (encoded: string): number => {
	return Number.parseInt(Buffer.from(encoded, "base64").toString("ascii"), 10);
};

// Generate permissions from role
export const generatePermissions = (role: string) => {
	return generateRole(role);
};
