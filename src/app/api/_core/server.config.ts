// Cấu hình cho các API route handlers để đảm bảo chạy trên edge runtime
export const serverConfig = {
	runtime: "edge" as const,
	dynamic: "force-dynamic" as const,
};
