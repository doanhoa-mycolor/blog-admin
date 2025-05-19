import { PrismaClient } from "@prisma/client";

// Variable to store Prisma instance
let prisma: PrismaClient;

// Check environment
if (process.env.NODE_ENV === "production") {
	// In production, create a new instance
	prisma = new PrismaClient();
} else {
	// In development, use global to cache instance
	if (!(global as any).prisma) {
		(global as any).prisma = new PrismaClient();
	}
	prisma = (global as any).prisma;
}

// Mark this file as only running on server
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default prisma;
