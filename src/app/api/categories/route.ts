import type { NextRequest } from "next/server";
import { CategoryController } from "../_controllers/category.controller";
import { serverConfig } from "../_core/server.config";

export const { runtime, dynamic } = serverConfig;

export async function GET(req: NextRequest) {
	return CategoryController.getAll(req);
}

export async function POST(req: NextRequest) {
	return CategoryController.create(req);
}
