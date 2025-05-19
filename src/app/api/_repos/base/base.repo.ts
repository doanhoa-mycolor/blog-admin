import prisma from "@/lib/prisma";
import type { GetAllQueryIF, RecordValue } from "../user.repo";

class BaseRepo {
	private tableModel: any;

	constructor(tableModel: any) {
		this.tableModel = tableModel;
	}

	constructOrderByClause = (sortField: string, sortOrder: string) => {
		const normalizedSortField = ["no", "status"].includes(sortField)
			? "id"
			: sortField;
		const normalizedSortOrder = sortOrder?.toLowerCase() ?? "";

		return [
			{ [normalizedSortField]: normalizedSortOrder },
			{ id: normalizedSortOrder },
		];
	};

	getAll = async () => {
		return await this.tableModel.findMany();
	};

	getAllWithQuery = async ({ sort, range, filter }: GetAllQueryIF) => {
		const [sortField, sortOrder] = sort;
		const [start, end] = range;

		const whereClause = Object.entries(filter).length
			? Object.fromEntries(
					Object.entries(filter).map(([key, value]) => [
						key,
						{ contains: value as string },
					]),
				)
			: {};

		const res = await this.tableModel.findMany({
			orderBy: this.constructOrderByClause(
				sortField as string,
				sortOrder as string,
			),
			skip: start ?? 0,
			take: (end ?? 0) - (start ?? 0) + 1,
			where: whereClause,
		});

		return res;
	};

	getAllWithQueryAndSafety = async ({ sort, range, filter }: GetAllQueryIF) => {
		const [sortField, sortOrder] = sort;
		const [start, end] = range;

		const whereClause = Object.entries(filter).length
			? Object.fromEntries(
					Object.entries(filter).map(([key, value]) => [
						key,
						{ contains: value as string },
					]),
				)
			: {};

		const res = await this.tableModel.findMany({
			orderBy: this.constructOrderByClause(
				sortField as string,
				sortOrder as string,
			),
			skip: start ?? 0,
			take: (end ?? 0) - (start ?? 0) + 1,
			where: { ...whereClause, isDeleted: false },
		});

		return res;
	};

	getOneById = (id: number) => {
		const res = this.tableModel.findUnique({
			where: {
				id: id,
			},
		});
		return res;
	};

	getOneWithParam = (params: RecordValue) => {
		const res = this.tableModel.findUnique({
			...params,
		});
		return res;
	};

	getOneByIdWithParam = (id: number, params: RecordValue) => {
		const res = this.tableModel.findUnique({
			where: {
				id,
			},
			...params,
		});
		return res;
	};

	insert = async (payload: RecordValue) => {
		return await this.tableModel.create({
			data: payload,
		});
	};

	insertMany = async (items: RecordValue[]) => {
		const operations = items.map((item: RecordValue) => {
			return this.tableModel.create({ data: item });
		});

		return await prisma.$transaction(operations);
	};

	updateById = async ({
		id,
		payload,
	}: {
		id: number;
		payload: RecordValue;
	}) => {
		return await this.tableModel.update({
			where: {
				id: id,
			},
			data: payload,
		});
	};

	updateManyById = async (updates: RecordValue[]) => {
		const operations = updates.map((update) => {
			const { id, ...data } = update;

			return this.tableModel.update({
				where: { id },
				data,
			});
		});

		return await prisma.$transaction(operations);
	};

	deleteById = async (id: number) => {
		return await this.tableModel.delete({
			where: {
				id: id,
			},
		});
	};

	safetyDeleteById = async (id: number) => {
		return await this.tableModel.update({
			where: {
				id: id,
			},
			data: {
				isDeleted: true,
			},
		});
	};

	deleteManyById = async (ids: number[]) => {
		const operations = ids.map((id) =>
			this.tableModel.delete({
				where: { id },
			}),
		);

		return await prisma.$transaction(operations);
	};

	safetyDeleteManyById = async (ids: number[]) => {
		const operations = ids.map((id) =>
			this.tableModel.update({
				where: { id },
				data: {
					isDeleted: true,
				},
			}),
		);

		return await prisma.$transaction(operations);
	};
}

export { BaseRepo };
