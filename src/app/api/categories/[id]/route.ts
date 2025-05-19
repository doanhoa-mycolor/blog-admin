import type { NextRequest } from "next/server";
import { CategoryController } from "../../_controllers/category.controller";
import { serverConfig } from "../../_core/server.config";

export const { runtime, dynamic } = serverConfig;

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	return CategoryController.getById(req, { params });
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	return CategoryController.update(req, { params });
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	return CategoryController.delete(req, { params });
}
