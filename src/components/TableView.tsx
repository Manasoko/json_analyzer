import {
  isTableCompatible,
  resolveTableData,
  extractColumns,
} from "../lib/tableCompability.ts";

interface TableViewProps {
  input: string;
}

type Status = "active" | "inactive" | "pending";

const STATUS_CLASSES: Record<Status, string> = {
  active:
    "bg-[rgba(74,163,101,0.12)] text-[#3a8f5a] border border-[rgba(74,163,101,0.25)]",
  inactive:
    "bg-[rgba(107,101,96,0.1)] text-[var(--text-muted)] border border-[var(--border)]",
  pending:
    "bg-[rgba(192,133,82,0.12)] text-[var(--accent)] border border-[rgba(192,133,82,0.3)]",
};

function getRowKey(row: Record<string, unknown>, index: number): string {
  const id = row["id"] ?? row["_id"] ?? row["key"];
  return id !== undefined ? String(id) : String(index);
}

export default function TableView({ input }: TableViewProps) {
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(input);
  } catch {
    parsed = null;
  }
  const check = parsed !== null && isTableCompatible(parsed);
  const resolvedData = resolveTableData(parsed);
  const columns = extractColumns(resolvedData);

  const renderCell = (column: unknown, value: unknown) => {
    if (column === "status") {
      const status = value as Status;

      return (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_CLASSES[status]}`}
        >
          {status}
        </span>
      );
    }

    if (value === null)
      return <span className="text-(--text-muted)">null</span>;

    if (value === "__nested__") {
      return (
        <span className="inline-block rounded-sm border border-(--border) bg-(--social-bg) px-2 py-0.5 text-[11px] text-(--text-muted) font-(--font-mono)">
          {"{ ... }"}
        </span>
      );
    }

    return String(value);
  };

  return (
    <section className="w-full h-full overflow-auto bg-(--bg-base) p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="m-0 text-[12px] text-(--text-muted) font-(--font-mono)">
          {resolvedData.length} records · {columns.length} columns
        </p>
        <button
          type="button"
          className="rounded-md border border-(--border) bg-transparent px-3 py-1.5 text-[12px] text-(--text-muted) font-(--font-sans) opacity-75 cursor-pointer transition-[color,border-color] duration-150 ease-in-out hover:text-(--text) hover:border-(--accent)"
        >
          Export CSV
        </button>
      </div>
      {check ? (
        <>
          <div className="overflow-x-auto rounded-[10px] border border-(--border) shadow-(--shadow)">
            <table className="w-full border-collapse">
              <thead className="bg-(--social-bg) border-b-2 border-(--border)">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className={`px-4 py-2.5 text-left uppercase tracking-[0.08em] text-[11px] text-(--text-muted) font-(--font-sans) ${
                        column === "id" ? "w-15" : ""
                      }`}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resolvedData.map((row, index) => {
                  const rowKey = getRowKey(row, index);

                  return (
                    <tr
                      key={rowKey}
                      className={`transition-colors duration-150 ease-in-out hover:bg-[rgba(192,133,82,0.06)] ${
                        index % 2 === 0 ? "bg-(--bg)" : "bg-(--social-bg)"
                      }`}
                    >
                      {columns.map((column) => (
                        <td
                          key={`${rowKey}-${column}`}
                          className={`border-b border-(--border) px-4 py-2.5 text-[13px] text-(--text) font-(--font-mono) ${
                            column === "id"
                              ? "text-[11px] text-(--text-muted)"
                              : ""
                          }`}
                        >
                          {renderCell(column, row[column])}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="pt-2.5 m-0 text-right text-[12px] text-(--text-muted) font-(--font-sans)">
            Showing {resolvedData.length} of {resolvedData.length} rows
          </p>
        </>
      ) : (
        <div className="flex items-center justify-center h-40">
          <p className="text-sm text-(--text-muted) font-(--font-sans)">
            This JSON structure can't be displayed as a table
          </p>
        </div>
      )}
    </section>
  );
}
