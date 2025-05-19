import prisma from "@/lib/prisma";
import type { Role } from "@prisma/client";
import { BaseRepo } from "./base/base.repo";

export type RecordValue = Record<string, any>;

export type FilterType = any;

export interface GetAllQueryIF {
	filter: FilterType;
	range: number[];
	sort: string[];
	include?: RecordValue;
}

export interface UserIF {
	id?: number;
	username: string;
	name: string;
	email: string;
	password?: string;
	newPassword?: string;
	role: Role;
	enabled: boolean;
	isDeleted?: boolean;
}

const model = prisma.user;

const exclude = <User, Key extends keyof User>(
	user: User,
	keys: Key[],
): Omit<User, Key> => {
	return Object.fromEntries(
		Object.entries(user as {}).filter(([key]) => !keys.includes(key as Key)),
	) as Omit<User, Key>;
};

const getAll = async () => {
	const res = (await new BaseRepo(model).getAll()).map((user: UserIF) =>
		exclude(user, ["password"]),
	);

	return res;
};

const getAllWithQuery = async ({ sort, range, filter }: GetAllQueryIF) => {
	const res = (
		await new BaseRepo(model).getAllWithQueryAndSafety({ sort, range, filter })
	).map((user: UserIF) => exclude(user, ["password"]));

	return res;
};

const getOneById = async (id: number) => {
	const res = await new BaseRepo(model).getOneById(id);
	if (res) {
		return exclude(res, ["password"]);
	}
	return res;
};

const getOneWithParam = async (params: RecordValue) => {
	const res = await new BaseRepo(model).getOneWithParam(params);
	return res;
};

const getPermission = async (userId: number) => {
	const res = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			role: true,
		},
	});

	return res;
};

const insert = async (payload: UserIF) => {
	return await new BaseRepo(model).insert(payload);
};

const updateById = async ({ id, payload }: { id: number; payload: UserIF }) => {
	return await new BaseRepo(model).updateById({ id, payload });
};

const deleteById = async (id: number) => {
	return await new BaseRepo(model).deleteById(id);
};

const deleteManyById = async (ids: number[]) => {
	return await new BaseRepo(model).deleteManyById(ids);
};

const safetyDeleteById = async (id: number) => {
	return await new BaseRepo(model).safetyDeleteById(id);
};

const safetyDeleteManyById = async (ids: number[]) => {
	return await new BaseRepo(model).safetyDeleteManyById(ids);
};

export {
	getAll,
	getOneById,
	insert,
	updateById,
	deleteById,
	deleteManyById,
	getOneWithParam,
	getPermission,
	getAllWithQuery,
	safetyDeleteById,
	safetyDeleteManyById,
};
