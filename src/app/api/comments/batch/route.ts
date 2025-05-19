import type { NextRequest } from "next/server";
import { BaseController } from "../../_controllers/base.controller";
import { serverConfig } from "../../_core/server.config";

export const { runtime, dynamic } = serverConfig;

export async function POST(req: NextRequest) {
	return BaseController.getBatch("comment", req);
}

export async function PUT(req: NextRequest) {
	return BaseController.updateBatch("comment", req);
}

export async function DELETE(req: NextRequest) {
	return BaseController.deleteBatch("comment", req);
}
