/**
 * Result/Either type pattern for error handling
 * Provides consistent error handling across the entire codebase.
 *
 * Canonical location for Result type and helpers.
 * Replaces: type-utils.ts (Result, toResult) and queries/result.ts (Result, success, error, isSuccess, isError, unwrap, unwrapOr)
 */

/**
 * Union type for success/error states
 * @template T - Success data type
 * @template E - Error type (defaults to Error)
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Create a successful Result
 */
export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Create an error Result
 */
export function error<T = never, E = Error>(err: E): Result<T, E> {
  return { success: false, error: err };
}

/**
 * Type guard for success
 */
export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success === true;
}

/**
 * Type guard for error
 */
export function isError<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false;
}

/**
 * Unwrap Result, throwing if error
 */
export function unwrap<T>(result: Result<T>): T {
  if (result.success) {
    return result.data;
  }
  throw result.error;
}

/**
 * Unwrap with default value
 */
export function unwrapOr<T>(result: Result<T>, defaultValue: T): T {
  return result.success ? result.data : defaultValue;
}

/**
 * Convert possibly undefined to Result
 */
export function toResult<T>(
  val: T | null | undefined,
  errorMessage = 'Value is null'
): Result<T> {
  if (val === null || val === undefined) {
    return { success: false, error: new Error(errorMessage) };
  }
  return { success: true, data: val };
}
