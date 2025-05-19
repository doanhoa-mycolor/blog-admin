import type { NextRequest } from "next/server";
import ErrorResponse, {
	BadRequestError,
	NotFoundError,
} from "../_core/error.response";
import SuccessResponse from "../_core/success.response";
import CategoryRepo from "../_repos/base/category.repo";

export class CategoryController {
	// Get all categories with pagination
	static async getAll(req: NextRequest) {
		try {
			// Parse query params
			const url = new URL(req.url);
			const page = Number.parseInt(url.searchParams.get("_page") || "1");
			const perPage = Number.parseInt(url.searchParams.get("_perPage") || "10");

			// Sort
			const sortField = url.searchParams.get("_sort") || "id";
			const sortOrder = url.searchParams.get("_order") || "ASC";

			// Filter
			const filter: any = {};
			// Add specific filters if needed
			if (url.searchParams.get("id")) {
				filter.id = url.searchParams.get("id");
			}
			if (url.searchParams.get("name")) {
				filter.name = url.searchParams.get("name");
			}
			if (url.searchParams.get("slug")) {
				filter.slug = url.searchParams.get("slug");
			}

			const result = await CategoryRepo.findAll({
				page,
				perPage,
				sort: { field: sortField, order: sortOrder },
				filter,
			});

			// Set content-range header for pagination
			const totalPages = Math.ceil(result.total / perPage);

			return SuccessResponse.OK(
				"Categories retrieved successfully",
				result.items,
				{
					"Content-Range": `categories ${(page - 1) * perPage}-${
						page * perPage > result.total ? result.total : page * perPage
					}/${result.total}`,
					"X-Total-Count": result.total.toString(),
					"X-Total-Pages": totalPages.toString(),
				},
			);
		} catch (error: any) {
			console.error("Error getting categories:", error);
			return ErrorResponse.InternalServerError(error.message);
		}
	}

	// Get category by ID
	static async getById(
		req: NextRequest,
		{ params }: { params: { id: string } },
	) {
		try {
			const id = Number.parseInt(params.id);
			if (isNaN(id)) {
				return new BadRequestError("Invalid category ID").send();
			}

			const category = await CategoryRepo.findById(id);
			if (!category) {
				return new NotFoundError("Category not found").send();
			}

			return SuccessResponse.OK("Category retrieved successfully", category);
		} catch (error: any) {
			console.error(`Error getting category ${params.id}:`, error);
			return ErrorResponse.InternalServerError(error.message);
		}
	}

	// Create new category
	static async create(req: NextRequest) {
		try {
			const body = await req.json();

			if (!body.name || !body.slug) {
				return new BadRequestError("Name and slug are required").send();
			}

			// Check if slug is unique
			const { items } = await CategoryRepo.findAll({
				filter: { slug: body.slug },
			});

			if (items.length > 0) {
				return new BadRequestError("Slug must be unique").send();
			}

			const category = await CategoryRepo.create({
				name: body.name,
				slug: body.slug,
			});

			return SuccessResponse.CREATED("Category created successfully", category);
		} catch (error: any) {
			console.error("Error creating category:", error);
			return ErrorResponse.InternalServerError(error.message);
		}
	}

	// Update category
	static async update(
		req: NextRequest,
		{ params }: { params: { id: string } },
	) {
		try {
			const id = Number.parseInt(params.id);
			if (isNaN(id)) {
				return new BadRequestError("Invalid category ID").send();
			}

			const body = await req.json();

			if (Object.keys(body).length === 0) {
				return new BadRequestError("No update data provided").send();
			}

			// Check if category exists
			const category = await CategoryRepo.findById(id);
			if (!category) {
				return new NotFoundError("Category not found").send();
			}

			// If updating slug, check uniqueness
			if (body.slug && body.slug !== category.slug) {
				const { items } = await CategoryRepo.findAll({
					filter: { slug: body.slug },
				});

				if (items.length > 0) {
					return new BadRequestError("Slug must be unique").send();
				}
			}

			const updatedCategory = await CategoryRepo.update(id, {
				name: body.name,
				slug: body.slug,
			});

			return SuccessResponse.OK(
				"Category updated successfully",
				updatedCategory,
			);
		} catch (error: any) {
			console.error(`Error updating category ${params.id}:`, error);
			return ErrorResponse.InternalServerError(error.message);
		}
	}

	// Delete category
	static async delete(
		req: NextRequest,
		{ params }: { params: { id: string } },
	) {
		try {
			const id = Number.parseInt(params.id);
			if (isNaN(id)) {
				return new BadRequestError("Invalid category ID").send();
			}

			// Check if category exists
			const category = await CategoryRepo.findById(id);
			if (!category) {
				return new NotFoundError("Category not found").send();
			}

			await CategoryRepo.delete(id);

			return SuccessResponse.OK("Category deleted successfully");
		} catch (error: any) {
			console.error(`Error deleting category ${params.id}:`, error);
			return ErrorResponse.InternalServerError(error.message);
		}
	}
}
