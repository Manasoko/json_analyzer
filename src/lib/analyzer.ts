import {detectDuplicateKeys} from "./checkDuplicate.ts"
import type {JsonValue, AnalysisResult, TypeCounts} from "../types.ts";

const EMPTY_TYPE_COUNTS: TypeCounts = {
    string: 0,
    number: 0,
    boolean: 0,
    null: 0,
    object: 0,
    array: 0,
};

export function analyzeJson(input: string): AnalysisResult {
    try {
        const parsed = JSON.parse(input) as JsonValue;
        const typeCounts: TypeCounts = {...EMPTY_TYPE_COUNTS};
        const warnings: string[] = [];
        let keyCount = 0;
        let depth = 0;
        let objects = 0;
        let arrays = 0;
        let nodes = 0;

        const visit = (value: JsonValue, level: number, path: string) => {
            nodes += 1;
            depth = Math.max(depth, level);

            if (value === null) {
                typeCounts.null += 1;
                return;
            }

            if (Array.isArray(value)) {
                arrays += 1;
                typeCounts.array += 1;

                if (level >= 5) {
                    warnings.push(`Deep array branch at ${path}`);
                }

                value.forEach((entry, index) => {
                    visit(entry, level + 1, `${path}[${index}]`);
                });
                return;
            }

            if (typeof value === "object") {
                objects += 1;
                typeCounts.object += 1;
                const entries = Object.entries(value);
                keyCount += entries.length;

                if (level >= 5) {
                    warnings.push(`Deep object branch at ${path}`);
                }

                entries.forEach(([key, entry]) => {
                    const nextPath = path === "$" ? `$.${key}` : `${path}.${key}`;
                    visit(entry, level + 1, nextPath);
                });
                return;
            }

            typeCounts[typeof value as "string" | "number" | "boolean"] += 1;
        };

        visit(parsed, 1, "$");

        const duplicateKeys = detectDuplicateKeys(input);
        duplicateKeys.forEach((key) => {
            warnings.push(`Duplicate key detected in source: "${key}"`);
        });

        const uniqueWarnings = [...new Set(warnings)];

        return {
            valid: true,
            depth,
            keyCount,
            typeCounts,
            warnings: uniqueWarnings.length > 0 ? uniqueWarnings : ["No structural warnings detected."],
            formatted: JSON.stringify(parsed, null, 2),
            objects,
            arrays,
            nodes,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Invalid JSON input.";

        return {
            valid: false,
            depth: 0,
            keyCount: 0,
            typeCounts: {...EMPTY_TYPE_COUNTS},
            warnings: ["Fix the syntax issue to generate structure analysis."],
            formatted: input,
            objects: 0,
            arrays: 0,
            nodes: 0,
            error: message,
        };
    }
}
