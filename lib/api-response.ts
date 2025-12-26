import { NextResponse } from "next/server";

type FieldErrors = Record<string, string[]>;

interface ErrorPayload {
  message: string;
  code?: string;
  fieldErrors?: FieldErrors;
}

export const successResponse = <T>(data: T, init?: ResponseInit) =>
  NextResponse.json({ success: true, data }, init);

export const errorResponse = (
  message: string,
  status = 400,
  options?: { code?: string; fieldErrors?: FieldErrors }
) =>
  NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: options?.code,
        fieldErrors: options?.fieldErrors,
      },
    },
    { status }
  );
