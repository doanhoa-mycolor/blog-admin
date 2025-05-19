import type { NextRequest } from "next/server";
import { BaseController } from "../../_controllers/base.controller";
import { serverConfig } from "../../_core/server.config";

export const { runtime, dynamic } = serverConfig;

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	return BaseController.getOne("user", Number.parseInt(params.id));
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	return BaseController.update("user", Number.parseInt(params.id), req);
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	return BaseController.delete("user", Number.parseInt(params.id));
}
