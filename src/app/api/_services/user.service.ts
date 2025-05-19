import type { GetAllQueryIF } from "@repo/types/response";
import {
	type UserIF,
	deleteById,
	deleteManyById,
	getAll,
	getAllWithQuery,
	getOneById,
	getOneWithParam,
	getPermission,
	insert,
	safetyDeleteById,
	safetyDeleteManyById,
	updateById,
} from "../_repos/user.repo";
import { hashPassword } from "../_utils/password";

class UserFactory {
	static async create({ payload }: { payload: UserIF }) {
		return await new User(payload).create();
	}

	static async getOneById(id: number) {
		return await getOneById(id);
	}

	static async getAll() {
		return await getAll();
	}

	static async getAllWithQuery({ filter, range, sort }: GetAllQueryIF) {
		return await getAllWithQuery({ filter, range, sort });
	}

	static async getPermission(userId: number) {
		return await getPermission(userId);
	}

	static async updateById({ id, payload }: { id: number; payload: UserIF }) {
		return await new User(payload).updateById({ id });
	}

	static async deleteById(id: number) {
		return await deleteById(id);
	}

	static async deleteManyById(ids: number[]) {
		return await deleteManyById(ids);
	}

	static async safetyDeleteById(id: number) {
		return await safetyDeleteById(id);
	}

	static async safetyDeleteManyById(ids: number[]) {
		return await safetyDeleteManyById(ids);
	}

	static async findByEmail({
		email,
		isDeleted,
	}: {
		email: string;
		isDeleted: boolean;
	}) {
		return await getOneWithParam({ where: { email, isDeleted } });
	}

	static async findByUsername({ username }: { username: string }) {
		return await getOneWithParam({ where: { username } });
	}
}

class User implements UserIF {
	public username: string;
	public name: string;
	public role: any;
	public enabled: boolean;
	public email: string;
	public password!: string;
	public isDeleted: boolean;

	public constructor({
		username,
		name,
		role,
		enabled,
		email,
		password,
		newPassword,
		isDeleted = false,
	}: UserIF) {
		this.username = username;
		this.name = name;
		this.role = role;
		this.enabled = enabled;
		this.email = email;
		this.isDeleted = isDeleted;

		if (password) {
			this.password = newPassword
				? hashPassword(newPassword)
				: hashPassword(password);
		}
	}

	public async create() {
		// TODO: validate payload
		return await insert(this);
	}

	public async updateById({ id }: { id: number }) {
		const payload: UserIF = this;

		// TODO: validate payload
		return await updateById({ id, payload });
	}
}

export default UserFactory;
