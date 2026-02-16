/**
 * Shared validation for production: IDs and redirects.
 * Use for API routes and server actions to prevent injection and open redirects.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_REGEX.test(value);
}

/** Safe relative path: must start with / and contain no protocol or // */
export function isSafeRelativePath(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.startsWith("/") && !trimmed.includes("//") && !/^https?:/i.test(trimmed);
}
