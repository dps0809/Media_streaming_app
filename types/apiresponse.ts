import { NextResponse } from "next/server";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export function createApiResponse(
  success: boolean,
  message: string,
  statusCode: number,
  data?: unknown
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success,
      message,
      ...(data !== undefined && { data }),
    },
    { status: statusCode }
  );
}
