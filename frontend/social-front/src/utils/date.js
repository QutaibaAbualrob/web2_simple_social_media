/**
 * Parses an ISO date string as UTC. The backend stores times in UTC, but when
 * serialized from SQLite/EF the value can have DateTimeKind.Unspecified, so
 * JSON may omit the "Z". Browsers then parse "2025-01-24T10:00:00" as local
 * time, which shifts "time ago" by the user's timezone offset.
 * This ensures we treat date-only and no-offset ISO strings as UTC.
 */
export function parseAsUtc(value) {
    if (value == null) return new Date(NaN);
    if (typeof value !== 'string') return new Date(value);
    const s = String(value).trim();
    if (!s) return new Date(NaN);
    // Already has timezone (Z or ±HH:MM) — parse as-is
    if (/Z$|[\+\-]\d{2}:?\d{2}$/i.test(s)) return new Date(s);
    // No timezone: backend sends UTC, so append Z
    return new Date(s + 'Z');
}
