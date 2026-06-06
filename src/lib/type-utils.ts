/**
 * Type Utilities for Cloudflare Workers + Astro SSR
 * Provides safe type assertions and guards for strict mode.
 * Merged from former src/lib/type-guards.ts.
 */

/**
 * Assert value is non-null/undefined
 * Throws if value is null or undefined
 */
export function assertNonNull<T>(
  val: T | null | undefined,
  message = 'Value is null or undefined'
): asserts val is T {
  if (val == null) {
    throw new Error(message);
  }
}

/**
 * Assert value is non-null after condition check
 * Use in if blocks where TypeScript can't infer nullability
 */
export function requireNonNull<T>(
  val: T | null | undefined,
  message = 'Required value is null'
): T {
  if (val == null) {
    throw new Error(message);
  }
  return val;
}

/**
 * Safe unwrap with default value
 */
export function unwrapOr<T>(
  val: T | null | undefined,
  defaultVal: T
): T {
  return val ?? defaultVal;
}

/**
 * Assert array is non-empty (for TS noUncheckedIndexedAccess)
 */
export function assertNonEmpty<T>(
  arr: T[],
  message = 'Array is empty'
): T[] {
  if (arr.length === 0) {
    throw new Error(message);
  }
  return arr;
}

/**
 * Get array element with bounds check
 */
export function getArrayElement<T>(
  arr: T[],
  index: number,
  defaultVal: T
): T {
  if (index < 0 || index >= arr.length) {
    return defaultVal;
  }
  return arr[index];
}

/**
 * Type-safe object property access
 */
export function getProp<T, K extends keyof T>(
  obj: T,
  key: K
): NonNullable<T[K]> {
  const val = obj[key];
  if (val == null) {
    throw new Error(`Property ${String(key)} is null or undefined`);
  }
  return val;
}

/**
 * Merge types, making optional fields required
 */
export type DeepRequired<T> = T extends object
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : T;

/**
 * Assert environment variable is set
 */
export function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return val;
}

// ─── Type Guards (merged from former src/lib/type-guards.ts) ─────────────────

/**
 * Check if value is a valid object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Check if env object is valid
 */
export function isValidEnv(env: unknown): env is Record<string, unknown> {
  return isObject(env) && Object.keys(env).length > 0;
}

/**
 * Check if API response has expected shape
 */
export function hasProperty<T extends object, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj;
}

/**
 * Validate and cast with type guard
 */
export function castToType<T>(
  value: unknown,
  guard: (v: unknown) => v is T
): T | undefined {
  return guard(value) ? value : undefined;
}