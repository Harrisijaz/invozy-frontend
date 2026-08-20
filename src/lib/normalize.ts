export type UnknownRecord = Record<string, unknown>;

export function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

export function pickRecord(value: unknown, keys: string[]): UnknownRecord {
  const record = asRecord(value);
  for (const key of keys) {
    const nested = record[key];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) return nested as UnknownRecord;
  }
  return record;
}

export function pickArray(value: unknown, keys: string[]): UnknownRecord[] {
  if (Array.isArray(value)) return value.map(asRecord);
  const record = asRecord(value);
  for (const key of keys) {
    const nested = record[key];
    if (Array.isArray(nested)) return nested.map(asRecord);
  }
  return [];
}

export function text(record: UnknownRecord, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
    if (typeof value === "boolean") return value ? "Yes" : "No";
  }
  return fallback;
}

export function numberValue(record: UnknownRecord, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return fallback;
}

export function boolValue(record: UnknownRecord, keys: string[], fallback = false) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") return value;
  }
  return fallback;
}

export function firstDefined<T>(...values: T[]) {
  return values.find((value) => value !== undefined && value !== null);
}
