import { PrismaClient } from "@prisma/client";

export default class CategoryRepo {
	private static prisma = new PrismaClient();

	static async findAll({
		page = 1,
		perPage = 10,
		sort = { field: "id", order: "asc" },
		filter = {} as Record<string, any>,
	}) {
		try {
			// Xử lý filter nếu có
			const where: any = {};

			if (filter.id) {
				where.id = Number.parseInt(filter.id);
			}

			if (filter.name) {
				where.name = { contains: filter.name };
			}

			if (filter.slug) {
				where.slug = { contains: filter.slug };
			}

			// Xử lý sort
			const orderBy: any = {};
			orderBy[sort.field] = sort.order.toLowerCase();

			// Count tổng số trước khi phân trang
			const total = await CategoryRepo.prisma.category.count({ where });

			// Query với phân trang
			const items = await CategoryRepo.prisma.category.findMany({
				where,
				orderBy,
				skip: (page - 1) * perPage,
				take: perPage,
			});

			return {
				items,
				total,
			};
		} catch (error) {
			console.error("Error in findAll categories:", error);
			throw error;
		}
	}

	static async findById(id: number) {
		try {
			return await CategoryRepo.prisma.category.findUnique({
				where: { id },
			});
		} catch (error) {
			console.error(`Error in findById category ${id}:`, error);
			throw error;
		}
	}

	static async create(data: { name: string; slug: string }) {
		try {
			return await CategoryRepo.prisma.category.create({
				data,
			});
		} catch (error) {
			console.error("Error in create category:", error);
			throw error;
		}
	}

	static async update(id: number, data: { name?: string; slug?: string }) {
		try {
			return await CategoryRepo.prisma.category.update({
				where: { id },
				data,
			});
		} catch (error) {
			console.error(`Error in update category ${id}:`, error);
			throw error;
		}
	}

	static async delete(id: number) {
		try {
			return await CategoryRepo.prisma.category.delete({
				where: { id },
			});
		} catch (error) {
			console.error(`Error in delete category ${id}:`, error);
			throw error;
		}
	}
}
