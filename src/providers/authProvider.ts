import type { AuthProvider } from "react-admin";

// With HttpOnly cookies, we cannot read directly from JS so we need to use API
const authProvider: AuthProvider = {
	// Login
	login: async ({ username, password }) => {
		const request = new Request("/api/access/auth", {
			method: "POST",
			body: JSON.stringify({ username, password }),
			headers: new Headers({ "Content-Type": "application/json" }),
			credentials: "include", // Important for browser to send and receive cookies
		});
		try {
			const response = await fetch(request);
			if (response.status < 200 || response.status >= 300) {
				throw new Error(response.statusText);
			}
			const auth = await response.json();
			if (!auth.success) {
				throw new Error(auth.error?.message || "Login failed");
			}

			localStorage.setItem(
				"permissions",
				JSON.stringify(auth.data.permissions),
			);

			// Return user data - cookie is set automatically
			return auth.data;
		} catch (error: any) {
			throw new Error(error.message || "Login failed");
		}
	},

	// Logout
	logout: async () => {
		try {
			// Get userId by calling status API
			const statusResponse = await fetch("/api/access/status", {
				method: "GET",
				credentials: "include",
			});

			const statusData = await statusResponse.json();

			if (statusData.success && statusData.data.authenticated) {
				// Call logout API
				const request = new Request("/api/access/logout", {
					method: "POST",
					body: JSON.stringify({ userId: statusData.data.userId }),
					headers: new Headers({ "Content-Type": "application/json" }),
					credentials: "include",
				});
				await fetch(request);
			}
		} catch (error) {
			console.error("Logout error:", error);
		}

		localStorage.removeItem("permissions");
		return Promise.resolve();
	},

	// Check if logged in
	checkAuth: async () => {
		try {
			// Call API to check authentication
			const response = await fetch("/api/access/status", {
				method: "GET",
				credentials: "include",
			});

			const data = await response.json();

			if (data.success && data.data.authenticated) {
				return Promise.resolve();
			}

			return Promise.reject();
		} catch (error) {
			return Promise.reject(error);
		}
	},

	// Check for errors
	checkError: async (error) => {
		const status = error.status;
		if (status === 401 || status === 403) {
			// Call logout API to clear cookies on server
			try {
				const statusResponse = await fetch("/api/access/status", {
					method: "GET",
					credentials: "include",
				});

				const statusData = await statusResponse.json();

				if (statusData.success && statusData.data.authenticated) {
					// Call logout API
					await fetch("/api/access/logout", {
						method: "POST",
						body: JSON.stringify({ userId: statusData.data.userId }),
						headers: new Headers({ "Content-Type": "application/json" }),
						credentials: "include",
					});
				}
			} catch (e) {
				console.error("Error during logout after auth error:", e);
			}

			return Promise.reject();
		}
		return Promise.resolve();
	},

	// Get permissions
	getPermissions: async () => {
		try {
			// Get permission from API
			const response = await fetch("/api/access/permission", {
				method: "GET",
				credentials: "include",
			});

			const data = await response.json();

			if (data.success) {
				return Promise.resolve(data.data);
			}

			return Promise.reject("Failed to get permissions");
		} catch (error) {
			return Promise.reject(error);
		}
	},

	// Get user identity
	getIdentity: async () => {
		try {
			// Get user info from status API
			const response = await fetch("/api/access/status", {
				method: "GET",
				credentials: "include",
			});

			const data = await response.json();

			if (data.success && data.data.authenticated) {
				return Promise.resolve({
					id: data.data.userId,
					fullName: "",
					avatar: undefined,
				});
			}

			return Promise.reject("User not found");
		} catch (error) {
			return Promise.reject(error);
		}
	},
};

export default authProvider;
