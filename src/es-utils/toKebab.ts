export function toKebab(s: string): string {
    return s.trim().replace(/\s+/g, "-").toLowerCase();
}
