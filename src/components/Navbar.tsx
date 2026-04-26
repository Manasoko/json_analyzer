type NavbarProps = {
  onClear: () => void;
};

export function Navbar({ onClear }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-14 border-b border-[var(--border)] bg-[var(--bg-base)]">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        <p className="m-0 text-[14px] tracking-[0.04em] text-[var(--text-h)] font-[var(--font-mono)]">
          JSON.analyze()
        </p>

        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer transition-[color,border-color] duration-150 ease-in-out rounded-md border border-[var(--border)] bg-transparent px-3 py-1.5 text-[12px] font-[var(--font-mono)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Clear
        </button>
      </div>
    </header>
  );
}
