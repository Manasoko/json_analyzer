/* Column Oriented */
function isColumnOriented(data: unknown): boolean {
  if (typeof data !== "object" || data === null || Array.isArray(data))
    return false;

  const values = Object.values(data as Record<string, unknown>);
  if (values.length === 0) return false;

  return values.every((v) => {
    if (typeof v !== "object" || v === null || Array.isArray(v)) return false;

    const keys = Object.keys(v as object);
    return keys.length > 0 && keys.every((k) => /^\d+$/.test(k));
  });
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

/* Row Oriented*/
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

/* Schema Oriented */
function isSchemaOriented(data: unknown): boolean {
  if (typeof data !== "object" || data === null || Array.isArray(data))
    return false;

  const d = data as Record<string, unknown>;

  return (
    Array.isArray(d["columns"]) &&
    Array.isArray(d["data"]) &&
    (d["data"] as unknown[]).every((row) => Array.isArray(row))
  );
}

function schemaToRows(
  data: Record<string, unknown>,
): Record<string, unknown>[] {
  const columns = data["columns"] as string[];
  const rows = data["data"] as unknown[][];

  return rows.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

/*---- Records Oriented ----*/
function isRecordsOriented(data: unknown): boolean {
  if (typeof data !== "object" || data === null || Array.isArray(data))
    return false;
  const values = Object.values(data as Record<string, unknown>);
  // single key whose value is a row-oriented array
  return values.length === 1 && isRowOriented(values[0]);
}

function recordsToRows(
  data: Record<string, unknown>,
): Record<string, unknown>[] {
  const rows = Object.values(data)[0];
  return rows as Record<string, unknown>[];
}

/*----- Values Oriented -----*/
function isValuesOriented(data: unknown): boolean {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every((row) => Array.isArray(row))
  );
}

function valuesToRows(data: unknown[][]): Record<string, unknown>[] {
  const columnCount = Math.max(...data.map((row) => row.length));
  const columns = Array.from({ length: columnCount }, (_, i) => `col_${i}`);
  return data.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      obj[col] = row[i] ?? null;
    });
    return obj;
  });
}

export function isTableCompatible(data: unknown): boolean {
  if (isRowOriented(data)) return true;

  if (isColumnOriented(data)) return true;
  if (isSchemaOriented(data)) return true;
  if (isRecordsOriented(data)) return true;
  if (isValuesOriented(data)) return true;

  return false;
}

export function resolveTableData(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];

  if (isColumnOriented(data)) {
    return transposeToRows(data as Record<string, Record<string, unknown>>);
  }

  if (isSchemaOriented(data)) {
    return schemaToRows(data as Record<string, unknown>);
  }

  if (isRecordsOriented(data)) {
    return recordsToRows(data as Record<string, unknown>);
  }

  if (isValuesOriented(data)) {
    return valuesToRows(data as unknown[][]);
  }
  return [];
}

export function extractColumns(data: Record<string, unknown>[]): string[] {
  const keySet = new Set<string>();
  data.forEach((row) => Object.keys(row).forEach((k) => keySet.add(k)));
  return Array.from(keySet);
}

export type TableOrientation =
  | "row"
  | "column"
  | "schema"
  | "records"
  | "values"
  | "incompatible";

export function detectOrientation(data: unknown): TableOrientation {
  if (isRowOriented(data)) return "row";
  if (isColumnOriented(data)) return "column";
  if (isSchemaOriented(data)) return "schema";
  if (isRecordsOriented(data)) return "records";
  if (isValuesOriented(data)) return "values";
  return "incompatible";
}
