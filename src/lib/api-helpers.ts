/**
 * HTTP response helpers for API routes.
 * Centralizes jsonResponse, errorResponse, and getErrorMessage patterns
 * duplicated across many API endpoints.
 */

/**
 * Create a JSON response with the given body and status code.
 */
export function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

/**
 * Create a JSON error response.
 */
export function errorResponse(message: string, code = 'ERROR', status = 500, details?: unknown): Response {
  return jsonResponse(
    { success: false, error: { code, message, ...(details ? { details } : {}) } },
    status,
  );
}

/**
 * Create a 401 Unauthorized response.
 */
export function unauthorizedResponse(message = 'Unauthorized'): Response {
  return errorResponse(message, 'UNAUTHORIZED', 401);
}

/**
 * Create a 403 Forbidden response.
 */
export function forbiddenResponse(message = 'Forbidden'): Response {
  return errorResponse(message, 'FORBIDDEN', 403);
}

/**
 * Create a 404 Not Found response.
 */
export function notFoundResponse(message = 'Not found'): Response {
  return errorResponse(message, 'NOT_FOUND', 404);
}

/**
 * Create a 400 Bad Request response.
 */
export function badRequestResponse(message: string, details?: unknown): Response {
  return errorResponse(message, 'BAD_REQUEST', 400, details);
}

/**
 * Extract a human-readable message from an unknown error.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
