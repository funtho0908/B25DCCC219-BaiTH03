export function readStorage(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") as unknown;
  } catch {
    return null;
  }
}
export function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage can be unavailable in private mode. */
  }
}
export function removeStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* Session remains usable in memory. */
  }
}
