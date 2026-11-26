import type { AnalysisPanelProps } from '../types.ts';

function WarningLine({ warning }: { warning: string }) {
    const keyPathMatch = warning.match(/\$[\w.[\]]+/);

    if (!keyPathMatch) {
        return (
            <li className='text-[12px] leading-5 text-(--text-muted)'>
                {warning}
            </li>
        );
    }

    const keyPath = keyPathMatch[0];
    const [beforePath, afterPath] = warning.split(keyPath);

    return (
        <li className='text-[12px] leading-5 text-(--text-muted)'>
            {beforePath}
            <span className='text-(--accent-warn)'>{keyPath}</span>
            {afterPath}
        </li>
    );
}

export default function AnalysisPanel({
    input,
    analysis,
    typeEntries,
    totalTypedValues,
    maxDepth,
}: AnalysisPanelProps) {
    const hasInput = input.trim().length > 0;
    const depthRatio = Math.min((analysis.depth / maxDepth) * 100, 100);
    const sizeKb = (new Blob([input]).size / 1024).toFixed(2);
    const structuralWarnings = analysis.warnings.filter(
        warning =>
            warning.includes('Deep ') || warning.includes('Duplicate key'),
    );

    return (
        <section className='flex-1 min-h-0'>
            <div className='flex-1 overflow-auto px-4 md:px-5 py-4'>
                {!hasInput ? (
                    <div className='h-full min-h-80 grid place-items-center text-center'>
                        <div>
                            <p className='m-0 text-[86px] leading-none opacity-[0.08] text-(--text-muted) font-(--font-mono)'>
                                {'{ }'}
                            </p>
                            <p className='mt-3 mb-0 text-[13px] text-(--text-muted) font-(--font-sans)'>
                                Paste JSON on the left to begin
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        <div className='grid grid-cols-2 gap-3'>
                            <article className='rounded-lg border border-(--border) bg-(--social-bg) p-4'>
                                <p className='m-0 uppercase tracking-widest text-[11px] text-(--text-muted) font-(--font-sans)'>
                                    Depth
                                </p>
                                <p className='mt-2 mb-0 text-[28px] leading-none text-(--text) font-(--font-mono)'>
                                    {analysis.depth}
                                </p>
                                <div className='mt-3 h-1.5 w-full rounded-full bg-(--bg)'>
                                    <div
                                        className='h-full rounded-full bg-(--accent)'
                                        style={{ width: `${depthRatio}%` }}
                                    />
                                </div>
                            </article>

                            <article className='rounded-lg border border-(--border) bg-(--social-bg) p-4'>
                                <p className='m-0 uppercase tracking-widest text-[11px] text-(--text-muted) font-(--font-sans)'>
                                    Total Keys
                                </p>
                                <p className='mt-2 mb-0 text-[28px] leading-none text-(--text) font-(--font-mono)'>
                                    {analysis.keyCount}
                                </p>
                            </article>

                            <article className='rounded-lg border border-(--border) bg-(--social-bg) p-4'>
                                <p className='m-0 uppercase tracking-widest text-[11px] text-(--text-muted) font-(--font-sans)'>
                                    Total Nodes
                                </p>
                                <p className='mt-2 mb-0 text-[28px] leading-none text-(--text) font-(--font-mono)'>
                                    {analysis.nodes}
                                </p>
                            </article>

                            <article className='rounded-lg border border-(--border) bg-(--social-bg) p-4'>
                                <p className='m-0 uppercase tracking-widest text-[11px] text-(--text-muted) font-(--font-sans)'>
                                    Size (KB)
                                </p>
                                <p className='mt-2 mb-0 text-[28px] leading-none text-(--text) font-(--font-mono)'>
                                    {sizeKb}
                                </p>
                            </article>
                        </div>

                        <section className='space-y-2'>
                            <h3 className='m-0 text-[12px] uppercase tracking-[0.08em] text-(--text-muted) font-(--font-sans)'>
                                Type Summary
                            </h3>
                            <div className='flex flex-wrap gap-2'>
                                {typeEntries.map(([type, count]) => (
                                    <div
                                        key={type}
                                        className='rounded-full border border-(--border) bg-(--social-bg) px-3 py-1 text-[12px] font-(--font-mono)'
                                    >
                                        <span className='text-(--text-muted)'>
                                            {type}
                                        </span>
                                        <span className='ml-1 text-(--accent)'>
                                            x {count}
                                        </span>
                                    </div>
                                ))}
                                {totalTypedValues === 0 ? (
                                    <div className='rounded-full border border-(--border) bg-(--social-bg) px-3 py-1 text-[12px] font-(--font-mono) text-(--text-muted)'>
                                        no values
                                    </div>
                                ) : null}
                            </div>
                        </section>

                        {structuralWarnings.length > 0 ? (
                            <section className='rounded-lg border-l-[3px] border-l-(--accent-warn) bg-(--bg-warn) px-4 py-3'>
                                <h3 className='m-0 text-[13px] text-(--accent-warn) font-(--font-sans)'>
                                    ⚠ Structural Warnings
                                </h3>
                                <ul className='mt-2 mb-0 list-none space-y-1 p-0 font-(--font-mono)'>
                                    {structuralWarnings.map(warning => (
                                        <WarningLine
                                            key={warning}
                                            warning={warning}
                                        />
                                    ))}
                                </ul>
                            </section>
                        ) : null}

                        <section className='rounded-lg border border-(--border) overflow-hidden'>
                            <pre className='m-0 max-h-85 overflow-auto bg-(--social-bg) p-4 text-[13px] leading-6 text-(--text) font-(--font-mono)'>
                                {analysis.formatted}
                            </pre>
                        </section>
                    </div>
                )}
            </div>
        </section>
    );
}
