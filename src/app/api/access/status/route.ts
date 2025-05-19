import type { NextRequest } from "next/server";
import { AccessController } from "../../_controllers/access.controller";
import { serverConfig } from "../../_core/server.config";

export const { runtime, dynamic } = serverConfig;

export async function GET(req: NextRequest) {
	return AccessController.checkStatus(req);
}
