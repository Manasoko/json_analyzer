import {isTableCompatible} from "../lib/tableConverter.ts"

const MOCK_COLUMNS = ["id", "name", "role", "city", "status", "joined"] as const;

const MOCK_ROWS = [
    {id: "001", name: "Ade Okafor", role: "Agent", city: "Lagos", status: "active", joined: "2023-01-14"},
    {id: "002", name: "Chisom Eze", role: "Buyer", city: "Abuja", status: "inactive", joined: "2022-09-03"},
    {id: "003", name: "Funke Balogun", role: "Seller", city: "Ibadan", status: "active", joined: "2023-07-22"},
    {id: "004", name: "Emeka Nwosu", role: "Agent", city: "__nested__", status: "pending", joined: "2024-02-11"},
    {id: "005", name: "Ngozi Adeyemi", role: "Buyer", city: "Enugu", status: "active", joined: "2021-11-30"},
] as const;

type Status = "active" | "inactive" | "pending";

const STATUS_CLASSES: Record<Status, string> = {
    active:
        "bg-[rgba(74,163,101,0.12)] text-[#3a8f5a] border border-[rgba(74,163,101,0.25)]",
    inactive:
        "bg-[rgba(107,101,96,0.1)] text-[var(--text-muted)] border border-[var(--border)]",
    pending:
        "bg-[rgba(192,133,82,0.12)] text-[var(--accent)] border border-[rgba(192,133,82,0.3)]",
};

export default function TableView(input: string) {
    const check: boolean = isTableCompatible(input)

    const renderCell = (column: (typeof MOCK_COLUMNS)[number], value: string) => {
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

        if (value === "__nested__") {
            return (
                <span
                    className="inline-block rounded-sm border border-(--border) bg-(--social-bg) px-2 py-0.5 text-[11px] text-(--text-muted) font-(--font-mono)">
          {"{ ... }"}
        </span>
            );
        }

        return value;
    };

    return (
        <section className="w-full h-full overflow-auto bg-(--bg-base) p-5">
            <div className="mb-3 flex items-center justify-between">
                <p className="m-0 text-[12px] text-(--text-muted) font-(--font-mono)">
                    5 records · 6 columns
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
                    <div className="overflow-hidden rounded-[10px] border border-(--border) shadow-(--shadow)">
                        <table className="w-full border-collapse">
                            <thead className="bg-(--social-bg) border-b-2 border-(--border)">
                            <tr>
                                {MOCK_COLUMNS.map((column) => (
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
                            {MOCK_ROWS.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className={`transition-colors duration-150 ease-in-out hover:bg-[rgba(192,133,82,0.06)] ${
                                        index % 2 === 0 ? "bg-(--bg)" : "bg-(--social-bg)"
                                    }`}
                                >
                                    {MOCK_COLUMNS.map((column) => (
                                        <td
                                            key={`${row.id}-${column}`}
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
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="pt-2.5 m-0 text-right text-[12px] text-(--text-muted) font-(--font-sans)">
                        Showing 5 of 5 rows
                    </p>
                </>

            ) : (
                <div className="flex items-center justify-between">
                    <p>Your JSON can't be in table view</p>
                </div>
            )}

        </section>
    );
}
