import type { DataProvider } from "react-admin";

// Helper function to fetch API
const fetchApi = async (url: string, method: string, body?: any) => {
	const headers: HeadersInit = {
		"Content-Type": "application/json",
	};

	const options: RequestInit = {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
		credentials: "include", // Quan trọng để browser gửi và nhận cookie
	};

	const response = await fetch(url, options);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error?.message || "API error");
	}

	const result = await response.json();
	return result.data;
};

export const prismaDataProvider: DataProvider = {
	// GET_LIST
	getList: async (resource, params) => {
		const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
		const { field, order } = params.sort || { field: "id", order: "ASC" };
		const filter = params.filter || {};

		try {
			// Use API instead of direct Prisma access
			const queryParams = new URLSearchParams({
				_page: page.toString(),
				_perPage: perPage.toString(),
				_sort: field,
				_order: order,
				...Object.entries(filter).reduce(
					(acc, [key, value]) => {
						acc[key] =
							value === undefined || value === null ? "" : String(value);
						return acc;
					},
					{} as Record<string, string>,
				),
			});

			const result = await fetchApi(
				`/api/${resource}?${queryParams.toString()}`,
				"GET",
			);

			return {
				data: result.items || [],
				total: Number.parseInt(result?.total || "0"),
			};
		} catch (error) {
			console.error("Error in getList:", error);
			throw error;
		}
	},

	// GET_ONE
	getOne: async (resource, params) => {
		const { id } = params;

		try {
			const data = await fetchApi(`/api/${resource}/${id}`, "GET");
			return { data };
		} catch (error) {
			console.error("Error in getOne:", error);
			throw error;
		}
	},

	// GET_MANY
	getMany: async (resource, params) => {
		const { ids } = params;

		try {
			const data = await fetchApi(`/api/${resource}/batch`, "POST", { ids });
			return { data };
		} catch (error) {
			console.error("Error in getMany:", error);
			throw error;
		}
	},

	// GET_MANY_REFERENCE
	getManyReference: async (resource, params) => {
		const { target, id } = params;
		const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
		const { field, order } = params.sort || { field: "id", order: "ASC" };
		const filter = { ...params.filter, [target]: id };

		try {
			const queryParams = new URLSearchParams({
				_page: page.toString(),
				_perPage: perPage.toString(),
				_sort: field,
				_order: order,
				...Object.entries(filter).reduce(
					(acc, [key, value]) => {
						acc[key] =
							value === undefined || value === null ? "" : String(value);
						return acc;
					},
					{} as Record<string, string>,
				),
			});

			const result = await fetchApi(
				`/api/${resource}?${queryParams.toString()}`,
				"GET",
			);

			return {
				data: result || [],
				total: Number.parseInt(result?.total || "0"),
			};
		} catch (error) {
			console.error("Error in getManyReference:", error);
			throw error;
		}
	},

	// CREATE
	create: async (resource, params) => {
		const { data } = params;

		try {
			const result = await fetchApi(`/api/${resource}`, "POST", data);
			return { data: result };
		} catch (error) {
			console.error("Error in create:", error);
			throw error;
		}
	},

	// UPDATE
	update: async (resource, params) => {
		const { id, data } = params;

		try {
			const result = await fetchApi(`/api/${resource}/${id}`, "PUT", data);
			return { data: result };
		} catch (error) {
			console.error("Error in update:", error);
			throw error;
		}
	},

	// UPDATE_MANY
	updateMany: async (resource, params) => {
		const { ids, data } = params;

		try {
			await fetchApi(`/api/${resource}/batch`, "PUT", { ids, data });
			return { data: ids };
		} catch (error) {
			console.error("Error in updateMany:", error);
			throw error;
		}
	},

	// DELETE
	delete: async (resource, params) => {
		const { id } = params;

		try {
			const result = await fetchApi(`/api/${resource}/${id}`, "DELETE");
			return { data: result };
		} catch (error) {
			console.error("Error in delete:", error);
			throw error;
		}
	},

	// DELETE_MANY
	deleteMany: async (resource, params) => {
		const { ids } = params;

		try {
			await fetchApi(`/api/${resource}/batch`, "DELETE", { ids });
			return { data: ids };
		} catch (error) {
			console.error("Error in deleteMany:", error);
			throw error;
		}
	},
};

export default prismaDataProvider;
