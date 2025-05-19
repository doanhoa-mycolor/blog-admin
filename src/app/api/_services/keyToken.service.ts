import prisma from "@/lib/prisma";

interface KeyTokenIF {
	userId: number;
	publicKey: string;
	privateKey: string;
	refreshToken: string;
}

const keyTokenModel = prisma.keyToken;

class KeyTokenService {
	static async createKeyToken({
		userId,
		publicKey,
		privateKey,
		refreshToken,
	}: KeyTokenIF) {
		try {
			const data = {
				publicKey,
				privateKey,
				refreshTokensUsed: [],
				refreshToken,
			};

			const tokens = await keyTokenModel.upsert({
				where: {
					userId: userId,
				},
				update: data,
				create: { userId, ...data },
			});
			return tokens ? tokens.publicKey : null;
		} catch (error) {
			return error;
		}
	}

	static async findByUserId(userId: number) {
		return await keyTokenModel.findUnique({ where: { userId } });
	}

	static async findByRefreshTokenUsed(refreshToken: string) {
		return await keyTokenModel.findUnique({
			where: { refreshToken },
		});
	}

	static async findByRefreshToken(refreshToken: string) {
		return await keyTokenModel.findUnique({ where: { refreshToken } });
	}

	static async removeKeyById(id: number) {
		return await keyTokenModel.delete({ where: { id } });
	}

	static async removeTokenByUserId(userId: number) {
		return await keyTokenModel.delete({ where: { userId } });
	}

	static async updateKeyById({
		id,
		oldToken,
		newToken,
	}: {
		id: number;
		oldToken: string;
		newToken: string;
	}) {
		try {
			// Lấy key token hiện tại
			const keyToken = await keyTokenModel.findUnique({
				where: { id },
			});

			if (!keyToken) {
				return null;
			}

			// Parse refreshTokensUsed từ JSON
			const refreshTokensUsed = Array.isArray(keyToken.refreshTokensUsed)
				? [...keyToken.refreshTokensUsed, oldToken]
				: [oldToken];

			// Cập nhật token
			return await keyTokenModel.update({
				where: { id },
				data: {
					refreshToken: newToken,
					refreshTokensUsed,
				},
			});
		} catch (error) {
			console.error("Error updating key token:", error);
			return null;
		}
	}
}

export default KeyTokenService;
