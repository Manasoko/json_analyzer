type EditorPanelProps = {
  input: string;
  isValid: boolean;
  error?: string;
  lastRun: string;
  onAnalyze: () => void;
  onInputChange: (value: string) => void;
};

export function EditorPanel({
  input,
  isValid,
  error,
  lastRun,
  onAnalyze,
  onInputChange,
}: EditorPanelProps) {
  const panelStateClass = isValid ? "border-l-[var(--accent)]" : "border-l-[#c0392b]";
  const textAreaBottomPadding = !isValid && error ? "pb-14" : "pb-5";

  return (
    <section
      className={`w-full md:w-[45%] h-[50%] md:h-full bg-[var(--bg-panel)] border-r border-[var(--border)] border-l-[3px] ${panelStateClass} relative flex flex-col`}
    >
      <div className="px-4 md:px-5 py-3 border-b border-[var(--border)] flex items-center justify-between gap-3">
        <p className="m-0 text-[11px] tracking-[0.08em] uppercase text-[var(--text-muted)] font-[var(--font-mono)]">
          // paste your json in
        </p>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--text-muted)] font-[var(--font-mono)]">
            {lastRun}
          </span>
          <button
            type="button"
            onClick={onAnalyze}
            className="cursor-pointer transition-[color,border-color] duration-150 ease-in-out rounded-md border border-[var(--border)] px-2.5 py-1 text-[11px] font-[var(--font-mono)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Analyze
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <textarea
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          spellCheck="false"
          className={`block h-full w-full resize-none border-0 bg-[var(--bg-base)] p-5 ${textAreaBottomPadding} text-[13px] leading-6 text-[var(--text-primary)] font-[var(--font-mono)] outline-none`}
        />
      </div>

      {!isValid && error ? (
        <div className="absolute left-0 right-0 bottom-0 bg-[#fdf0ee] border-t border-[#e5c5c0] px-4 py-2.5 text-[12px] text-[#c0392b] font-[var(--font-mono)]">
          {error}
        </div>
      ) : null}
    </section>
  );
}
