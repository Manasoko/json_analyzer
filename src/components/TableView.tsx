import {
    isTableCompatible,
    resolveTableData,
    extractColumns,
    detectOrientation
} from "../lib/tableCompability.ts";

import { JSONToCSV, downloadCSV } from "../lib/jsonToCsv.ts"
import {useMemo} from "react";

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

function inferColumnWidth(column: string, data: Record<string, unknown>[]): string {
    const maxLength = Math.max(...data.map(row => String(row[column] ?? "").length));
    if (maxLength <= 6) return "w-16";
    if (maxLength <= 15) return "w-32";
    if (maxLength > 40) return "max-w-[200px] truncate";
    return "";
}

export default function TableView({input}: TableViewProps) {
    let parsed: unknown = null;
    try {
        parsed = JSON.parse(input);
    } catch {
        parsed = null;
    }
    const check = parsed !== null && isTableCompatible(parsed);
    const orientation = parsed !== null && detectOrientation(parsed);
    const resolvedData = resolveTableData(parsed);
    const columns = extractColumns(resolvedData);

    const columnWidths = useMemo(() => {
        return Object.fromEntries(
            columns.map(col => [col, inferColumnWidth(col, resolvedData)])
        );
    }, [columns, resolvedData]);


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

        if (value === null || value === undefined)
            return <span className="text-(--text-muted) opacity-50">—</span>;


        if (value === "__nested__") {
            return (
                <span
                    className="inline-block rounded-sm border border-(--border) bg-(--social-bg) px-2 py-0.5 text-[11px] text-(--text-muted) font-(--font-mono)">
          {"{ ... }"}
        </span>
            );
        }

        if (typeof value === "boolean")
            return (
                <span className={value
                    ? "text-[#3a8f5a] font-medium"
                    : "text-(--text-muted)"
                }>
      {value ? "true" : "false"}
    </span>
            );

        return String(value);
    };

    return (
        <section className="w-full h-full overflow-auto bg-(--bg-base) p-5">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-[12px] text-(--text-muted) font-(--font-mono)">
                    {resolvedData.length} records · {columns.length} columns · {orientation}-oriented
                </p>
                <button
                    type="button"
                    className="rounded-md border border-(--border) bg-transparent px-3 py-1.5 text-[12px] text-(--text-muted) font-(--font-sans) opacity-75 cursor-pointer transition-[color,border-color] duration-150 ease-in-out hover:text-(--text) hover:border-(--accent)"
                    onClick={() => {
                        const csv = JSONToCSV(resolvedData);
                        downloadCSV(csv, "data.csv");
                    }}
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
                                        className={`px-4 py-2.5 text-left uppercase tracking-[0.08em] text-[11px] text-(--text-muted) font-(--font-sans) ${columnWidths[column]}`}
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
                                                className={`border-b border-(--border) px-4 py-2.5 text-[13px] text-(--text) font-(--font-mono) ${columnWidths[column]}`}
                                                title={String(resolvedData[index]?.[column] ?? "")}  // full value on hover
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
