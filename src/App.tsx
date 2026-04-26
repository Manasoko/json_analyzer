import {useEffect, useMemo, useState} from "react";
import Analysis from "./components/Analysis.tsx";
import {EditorPanel} from "./components/EditorPanel";
import {Navbar} from "./components/Navbar";
import { analyzeJson } from "./lib/analyzer.ts"


type TypeCounts = Record<
    "string" | "number" | "boolean" | "null" | "object" | "array",
    number
>;

type AnalysisResult = {
    valid: boolean;
    depth: number;
    keyCount: number;
    typeCounts: TypeCounts;
    warnings: string[];
    formatted: string;
    objects: number;
    arrays: number;
    nodes: number;
    error?: string;
};

const SAMPLE_JSON = `{
  "project": "json_analyzer",
  "status": "active",
  "metrics": {
    "records": 128,
    "valid": true,
    "regions": ["lagos", "berlin", "remote"]
  },
  "pipeline": {
    "stages": {
      "ingest": { "latency": 82 },
      "transform": { "latency": 124 },
      "report": { "latency": 48 }
    }
  }
}`;

const MAX_DEPTH_DISPLAY = 10;

function App() {
    const [input, setInput] = useState(SAMPLE_JSON);
    const [analysis, setAnalysis] = useState<AnalysisResult>(() => analyzeJson(SAMPLE_JSON));
    const [lastRun, setLastRun] = useState("Auto");

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setAnalysis(analyzeJson(input));
            setLastRun("Auto");
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [input]);

    const runAnalysis = () => {
        setAnalysis(analyzeJson(input));
        setLastRun("Manual");
    };

    const clearInput = () => {
        setInput("");
        setLastRun("Manual");
    };

    const typeEntries = useMemo(
        () =>
            Object.entries(analysis.typeCounts).filter(([, count]) => count > 0) as Array<
                [keyof TypeCounts, number]
            >,
        [analysis.typeCounts],
    );

    const totalTypedValues = useMemo(
        () => typeEntries.reduce((sum, [, count]) => sum + count, 0),
        [typeEntries],
    );

    return (
        <div className="min-h-screen bg-(--bg) text-(--text) font-(--font-sans)">
            <Navbar onClear={clearInput}/>

            <main className="pt-14 h-screen">
                <div className="h-full flex flex-col md:flex-row">
                    <EditorPanel
                        input={input}
                        isValid={analysis.valid}
                        error={analysis.error}
                        lastRun={lastRun}
                        onInputChange={(value) => setInput(value)}
                        onAnalyze={runAnalysis}
                    />

                    <Analysis
                        input={input}
                        analysis={analysis}
                        typeEntries={typeEntries}
                        totalTypedValues={totalTypedValues}
                        maxDepth={MAX_DEPTH_DISPLAY}
                    />
                </div>
            </main>
        </div>
    );
}

export default App;
