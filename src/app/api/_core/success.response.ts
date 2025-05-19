import { NextResponse } from "next/server";

export interface SuccessResponseDto<T> {
	success: boolean;
	code: number;
	message: string;
	data: T;
}

class SuccessResponseBase {
	constructor(
		public readonly message: string,
		public readonly metadata: any = {},
		public readonly code: number = 200,
	) {}

	send(headers: HeadersInit = {}) {
		return NextResponse.json(
			{
				success: true,
				code: this.code,
				message: this.message,
				data: this.metadata,
			},
			{ status: this.code, headers },
		);
	}
}

export class OK<T> extends SuccessResponseBase {
	constructor(message: string, metadata: T = {} as T) {
		super(message, metadata, 200);
	}
}

export class CREATED<T> extends SuccessResponseBase {
	constructor(message: string, metadata: T = {} as T) {
		super(message, metadata, 201);
	}
}

export class SuccessResponse {
	static OK<T>(
		message = "OK",
		metadata: T = {} as T,
		headers: HeadersInit = {},
	) {
		return new OK(message, metadata).send(headers);
	}

	static CREATED<T>(
		message = "Created",
		metadata: T = {} as T,
		headers: HeadersInit = {},
	) {
		return new CREATED(message, metadata).send(headers);
	}
}

export default SuccessResponse;
