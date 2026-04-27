function isColumnOriented(data: unknown): boolean {
  if (typeof data !== "object" || data === null || Array.isArray(data))
    return false;

  const values = Object.values(data as Record<string, unknown>);
  if (values.length === 0) return false;

  return values.every(
    (v) => typeof v === "object" && v !== null && !Array.isArray(v),
  );
}

function transposeToRows(
  data: Record<string, Record<string, unknown>>,
): Record<string, unknown>[] {
  const columns = Object.keys(data);
  const rowKeys = Object.keys(data[columns[0]]); // ["0", "1", "2"]

  return rowKeys.map((rowKey) => {
    const row: Record<string, unknown> = {};
    columns.forEach((col) => {
      row[col] = data[col][rowKey];
    });
    return row;
  });
}

function isRowOriented(data: unknown): boolean {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      (item) =>
        typeof item === "object" && item !== null && !Array.isArray(item),
    ) &&
    data.some((item) => Object.keys(item as object).length > 0)
  );
}

export function isTableCompatible(data: unknown): boolean {
  if (isRowOriented(data)) return true;

  if (isColumnOriented(data)) return true;

  return false;
}

export function resolveTableData(data: unknown): Record<string, unknown>[] {
    if (Array.isArray(data)) return data as Record<string, unknown>[];

    if (isColumnOriented(data)) {
        return transposeToRows(data as Record<string, Record<string, unknown>>);
    }

    return [];
}

export function extractColumns(data: Record<string, unknown>[]): string[] {
  const keySet = new Set<string>();
  data.forEach((row) => Object.keys(row).forEach((k) => keySet.add(k)));
  return Array.from(keySet);
}
