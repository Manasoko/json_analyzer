type Row = Record<string, unknown>;

export function JSONToCSV(jsonData: unknown): string {
  if (!Array.isArray(jsonData)) return "";

  const rows = jsonData as Row[];

  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);

  const escapeValue = (value: unknown): string => {
    if (value === null || value === undefined) return "";

    const str = String(value);

    // Escape quotes by doubling them
    const escaped = str.replace(/"/g, '""');

    // Wrap in quotes if needed
    if (/[",\n]/.test(str)) {
      return `"${escaped}"`;
    }

    return escaped;
  };

  let csv = "";

  // Header row
  csv += headers.join(",") + "\n";

  // Data rows
  for (const row of rows) {
    const values = headers.map((header) =>
      escapeValue(row[header])
    );
    csv += values.join(",") + "\n";
  }

  return csv;
}

export function downloadCSV(csv: string, filename = "data.csv") {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}