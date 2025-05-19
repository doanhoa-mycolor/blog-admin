import { NextResponse } from "next/server";

export interface ErrorResponseDto {
	success: boolean;
	code: number;
	message: string;
	stack?: string;
}

class ErrorResponseBase extends Error {
	public readonly success: boolean;
	public readonly message: string;

	constructor(
		message: string,
		public readonly code: number,
		public readonly statusCode: number,
	) {
		super(message);
		this.success = false;
		this.message = message;
	}

	send(headers: HeadersInit = {}) {
		const errorBody: ErrorResponseDto = {
			success: this.success,
			code: this.code,
			message: this.message,
		};

		if (process.env.NODE_ENV === "development") {
			errorBody.stack = this.stack;
		}

		return NextResponse.json(
			{
				success: false,
				error: errorBody,
			},
			{ status: this.statusCode, headers },
		);
	}
}

export class BadRequestError extends ErrorResponseBase {
	constructor(message = "Bad request", code = 400) {
		super(message, code, 400);
	}
}

export class UnauthorizedError extends ErrorResponseBase {
	constructor(message = "Unauthorized", code = 401) {
		super(message, code, 401);
	}
}

export class ForbiddenError extends ErrorResponseBase {
	constructor(message = "Forbidden", code = 403) {
		super(message, code, 403);
	}
}

export class NotFoundError extends ErrorResponseBase {
	constructor(message = "Resource not found", code = 404) {
		super(message, code, 404);
	}
}

export class InternalServerError extends ErrorResponseBase {
	constructor(message = "Internal Server Error", code = 500) {
		super(message, code, 500);
	}
}

export class ErrorResponse {
	static BadRequest(message = "Bad request") {
		return new BadRequestError(message).send();
	}

	static Unauthorized(message = "Unauthorized") {
		return new UnauthorizedError(message).send();
	}

	static Forbidden(message = "Forbidden") {
		return new ForbiddenError(message).send();
	}

	static NotFound(message = "Resource not found") {
		return new NotFoundError(message).send();
	}

	static InternalServerError(message = "Internal Server Error") {
		return new InternalServerError(message).send();
	}
}

export default ErrorResponse;
