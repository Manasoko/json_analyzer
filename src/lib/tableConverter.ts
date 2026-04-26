export function isTableCompatible(data: unknown): boolean {
    return (
        Array.isArray(data) &&
        data.length > 0 &&
        data.every(item => typeof item === "object" && !Array.isArray(item))
    );
}

export function extractColumns(data: Record<string, unknown>[]): string[] {
    const keySet = new Set<string>();
    data.forEach(row => Object.keys(row).forEach(k => keySet.add(k)));
    return Array.from(keySet);
}