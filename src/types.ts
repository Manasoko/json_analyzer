export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [key: string]: JsonValue };

export type TypeCounts = Record<
    "string" | "number" | "boolean" | "null" | "object" | "array",
    number
>;

export type AnalysisResult = {
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

export type AnalysisData = {
    valid: boolean;
    depth: number;
    keyCount: number;
    typeCounts: {
        string: number;
        number: number;
        boolean: number;
        null: number;
        object: number;
        array: number;
    };
    warnings: string[];
    formatted: string;
    nodes: number;
};

export type AnalysisPanelProps = {
    input: string;
    analysis: AnalysisData;
    typeEntries: Array<
        [keyof AnalysisData["typeCounts"], number]
    >;
    totalTypedValues: number;
    maxDepth: number;
};