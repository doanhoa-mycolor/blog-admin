import type { NextRequest } from "next/server";
import { BaseController } from "../_controllers/base.controller";
import { serverConfig } from "../_core/server.config";

export const { runtime, dynamic } = serverConfig;

export async function GET(req: NextRequest) {
	return BaseController.getList("comment", req);
}

export async function POST(req: NextRequest) {
	return BaseController.create("comment", req);
}
