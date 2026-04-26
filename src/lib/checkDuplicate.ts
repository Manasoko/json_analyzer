export function detectDuplicateKeys(source: string) {
    const duplicates = new Set<string>();
    const stack: Array<Set<string>> = [];
    let inString = false;
    let escaped = false;

    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];

        if (inString) {
            if (escaped) {
                escaped = false;
                continue;
            }

            if (char === "\\") {
                escaped = true;
                continue;
            }

            if (char === '"') {
                inString = false;
            }

            continue;
        }

        if (char === '"') {
            const start = index + 1;
            let end = start;
            let localEscaped = false;

            while (end < source.length) {
                const current = source[end];

                if (localEscaped) {
                    localEscaped = false;
                } else if (current === "\\") {
                    localEscaped = true;
                } else if (current === '"') {
                    break;
                }

                end += 1;
            }

            const key = source.slice(start, end);
            let lookAhead = end + 1;

            while (lookAhead < source.length && /\s/.test(source[lookAhead])) {
                lookAhead += 1;
            }

            if (source[lookAhead] === ":" && stack.length > 0) {
                const currentScope = stack[stack.length - 1];

                if (currentScope.has(key)) {
                    duplicates.add(key);
                } else {
                    currentScope.add(key);
                }
            }

            index = end;
            continue;
        }

        if (char === "{") {
            stack.push(new Set<string>());
            continue;
        }

        if (char === "}") {
            stack.pop();
        }
    }

    return [...duplicates];
}