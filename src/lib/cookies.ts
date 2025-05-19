// Cookie name constants
export const COOKIE_NAMES = {
	AUTH_TOKEN: "blog_auth_token",
	USER_ID: "blog_user_id",
	USER_ROLE: "blog_user_role",
};

/**
 * Get cookie value on client side
 */
export const getClientCookieValue = (name: string): string | null => {
	if (typeof document === "undefined") return null;

	try {
		const cookieString = document.cookie;
		if (!cookieString) return null;

		const cookies = cookieString.split("; ");
		const cookiePair = cookies.find((row) => row.startsWith(`${name}=`));

		if (cookiePair) {
			const cookieValue = cookiePair.split("=")[1];
			// Ensure valid cookie value
			if (
				cookieValue &&
				cookieValue !== "undefined" &&
				cookieValue !== "null"
			) {
				return decodeURIComponent(cookieValue);
			}
		}

		return null;
	} catch (error) {
		console.error("Error reading cookie:", name, error);
		return null;
	}
};

/**
 * Set cookie on client side
 */
export const setClientCookie = (
	name: string,
	value: string,
	options: {
		path?: string;
		expires?: Date | number;
		secure?: boolean;
		httpOnly?: boolean;
		sameSite?: "strict" | "lax" | "none";
	} = {},
): void => {
	if (typeof document === "undefined") return;

	try {
		const { path = "/", secure = true, sameSite = "lax" } = options;

		let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}`;

		if (options.expires) {
			if (typeof options.expires === "number") {
				const date = new Date();
				date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
				cookieString += `; expires=${date.toUTCString()}`;
			} else {
				cookieString += `; expires=${options.expires.toUTCString()}`;
			}
		}

		if (secure) cookieString += "; secure";
		if (options.httpOnly) cookieString += "; httpOnly";
		cookieString += `; sameSite=${sameSite}`;

		document.cookie = cookieString;
	} catch (error) {
		console.error("Error setting cookie:", name, error);
	}
};

/**
 * Remove cookie on client side
 */
export const removeClientCookie = (name: string, path = "/"): void => {
	if (typeof document === "undefined") return;

	try {
		document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0`;
	} catch (error) {
		console.error("Error removing cookie:", name, error);
	}
};
