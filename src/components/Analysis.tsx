import { useState } from "react";
import type { AnalysisPanelProps } from "../types.ts";
import AnalysisPanel from "./AnalysisPanel.tsx";
import TableView from "./TableView.tsx";

function Analysis({
                           input,
                           analysis,
                           typeEntries,
                           totalTypedValues,
                           maxDepth,
                         }: AnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<"analysis" | "table">("analysis");

  return (
    <section className="w-full md:w-[55%] h-[50%] md:h-full bg-(--bg-base) flex flex-col min-h-0">
      <div className="px-4 md:px-5 py-3 border-b border-(--border)">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("analysis")}
            className={`cursor-pointer transition-[color,border-color] duration-150 ease-in-out border-b-2 pb-1 text-[13px] font-(--font-sans) ${
              activeTab === "analysis"
                ? "border-(--accent) text-(--text-primary)"
                : "border-transparent text-(--text-muted) hover:border-(--accent) hover:text-(--text-primary)"
            }`}
          >
            Analysis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("table")}
            className={`cursor-pointer transition-[color,border-color] duration-150 ease-in-out border-b-2 pb-1 text-[13px] font-(--font-sans) ${
              activeTab === "table"
                ? "border-(--accent) text-(--text-primary)"
                : "border-transparent text-(--text-muted) hover:border-(--accent) hover:text-(--text-primary)"
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {activeTab === "analysis" ? (
        <AnalysisPanel
          input={input}
          analysis={analysis}
          typeEntries={typeEntries}
          totalTypedValues={totalTypedValues}
          maxDepth={maxDepth}
        />
      ) : (
        <TableView input={input} />
      )}
    </section>
  );
}

export default Analysis
