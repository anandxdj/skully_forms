// ─── Success Response ─────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// ─── Error Response ───────────────────────────────────────────────────────────

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message };
}

export function errorResponse(
  code: string,
  message: string,
  details?: unknown,
): ApiErrorResponse {
  return { success: false, error: { code, message, details } };
}
