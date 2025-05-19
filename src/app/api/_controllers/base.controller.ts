import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import ErrorResponse, {
	BadRequestError,
	NotFoundError,
} from "../_core/error.response";
import SuccessResponse from "../_core/success.response";

export class BaseController {
	static async getList(resource: string, req: NextRequest) {
		try {
			// Parse query parameters
			const url = new URL(req.url);
			const page = Number.parseInt(url.searchParams.get("page") || "1");
			const perPage = Number.parseInt(url.searchParams.get("perPage") || "10");
			const sort = url.searchParams.get("sort") || "id";
			const order = url.searchParams.get("order") || "ASC";
			const filterString = url.searchParams.get("filter") || "{}";

			let filter = {};
			try {
				filter = JSON.parse(filterString);
			} catch (error) {
				console.error("Error parsing filter:", error);
			}

			// Calculate pagination
			const skip = (page - 1) * perPage;

			// Construct query options
			const options: any = {
				skip,
				take: perPage,
				orderBy: {
					[sort]: order.toLowerCase(),
				},
				where: { ...filter },
			};

			// Count total items
			const total = await (prisma as any)[resource].count({
				where: options.where,
			});

			// Fetch data
			const items = await (prisma as any)[resource].findMany(options);

			return SuccessResponse.OK("Items retrieved successfully", {
				items,
				total,
			});
		} catch (error: any) {
			console.error(`Error in ${resource} getList:`, error);
			return ErrorResponse.InternalServerError(error.message);
		}
	}

	static async getOne(resource: string, id: number) {
		try {
			const item = await (prisma as any)[resource].findUnique({
				where: { id: Number(id) },
			});

			if (!item) {
				return new NotFoundError(`${resource} with id ${id} not found`).send();
			}

			return SuccessResponse.OK("Item retrieved successfully", item);
		} catch (error: any) {
			console.error(`Error in ${resource} getOne:`, error);
			return ErrorResponse.InternalServerError(error.message);
		}
	}

	static async getBatch(resource: string, req: NextRequest) {
		try {
			const { ids } = await req.json();

			if (!Array.isArray(ids)) {
				return new BadRequestError("ids must be an array").send();
			}

			const items = await (prisma as any)[resource].findMany({
				where: {
					id: { in: ids.map(Number) },
				},
			});

			return SuccessResponse.OK("Items retrieved successfully", items);
		} catch (error: any) {
			console.error(`Error in ${resource} getBatch:`, error);
			return ErrorResponse.InternalServerError(error.message);
		}
	}

	static async create(resource: string, req: NextRequest) {
		try {
			const data = await req.json();

			// Process data for creation (convert ID strings to numbers, etc.)
			const processedData = Object.keys(data).reduce((acc: any, key) => {
				if (key.endsWith("Id") && typeof data[key] === "string") {
					acc[key] = Number(data[key]);
				} else {
					acc[key] = data[key];
				}
				return acc;
			}, {});

			const newItem = await (prisma as any)[resource].create({
				data: processedData,
			});

			return SuccessResponse.CREATED("Item created successfully", newItem);
		} catch (error: any) {
			console.error(`Error in ${resource} create:`, error);
			return ErrorResponse.InternalServerError(error.message);
		}
	}

	static async update(resource: string, id: number, req: NextRequest) {
		try {
			const data = await req.json();

			// Process data for update
			const processedData = Object.keys(data).reduce((acc: any, key) => {
				if (key === "id") return acc; // Skip id field
				if (key.endsWith("Id") && typeof data[key] === "string") {
					acc[key] = Number(data[key]);
				} else {
					acc[key] = data[key];
				}
				return acc;
			}, {});

			const updatedItem = await (prisma as any)[resource].update({
				where: { id: Number(id) },
				data: processedData,
			});

			return SuccessResponse.OK("Item updated successfully", updatedItem);
		} catch (error: any) {
			console.error(`Error in ${resource} update:`, error);
			return ErrorResponse.InternalServerError(error.message);
		}
	}

	static async updateBatch(resource: string, req: NextRequest) {
		try {
			const { ids, data } = await req.json();

			if (!Array.isArray(ids)) {
				return new BadRequestError("ids must be an array").send();
			}

			// Process data for update
			const processedData = Object.keys(data).reduce((acc: any, key) => {
				if (key === "id") return acc; // Skip id field
				if (key.endsWith("Id") && typeof data[key] === "string") {
					acc[key] = Number(data[key]);
				} else {
					acc[key] = data[key];
				}
				return acc;
			}, {});

			await (prisma as any)[resource].updateMany({
				where: {
					id: { in: ids.map(Number) },
				},
				data: processedData,
			});

			return SuccessResponse.OK("Items updated successfully", ids);
		} catch (error: any) {
			console.error(`Error in ${resource} updateBatch:`, error);
			return ErrorResponse.InternalServerError(error.message);
		}
	}

	static async delete(resource: string, id: number) {
		try {
			const item = await (prisma as any)[resource].findUnique({
				where: { id: Number(id) },
			});

			if (!item) {
				return new NotFoundError(`${resource} with id ${id} not found`).send();
			}

			await (prisma as any)[resource].delete({
				where: { id: Number(id) },
			});

			return SuccessResponse.OK("Item deleted successfully", item);
		} catch (error: any) {
			console.error(`Error in ${resource} delete:`, error);
			return ErrorResponse.InternalServerError(error.message);
		}
	}

	static async deleteBatch(resource: string, req: NextRequest) {
		try {
			const { ids } = await req.json();

			if (!Array.isArray(ids)) {
				return new BadRequestError("ids must be an array").send();
			}

			await (prisma as any)[resource].deleteMany({
				where: {
					id: { in: ids.map(Number) },
				},
			});

			return SuccessResponse.OK("Items deleted successfully", ids);
		} catch (error: any) {
			console.error(`Error in ${resource} deleteBatch:`, error);
			return ErrorResponse.InternalServerError(error.message);
		}
	}
}
