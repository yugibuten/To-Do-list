import { FiCheckCircle } from "react-icons/fi";

const Header = ({ stats, greeting, isTyping, name, onChangeName }) => {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        {greeting ? (
          <p className="text-title text-3xl md:text-4xl text-ink">
            {greeting}
            <span className={isTyping ? "inline-block animate-pulse" : "opacity-0"}>▋</span>
          </p>
        ) : null}
        <p className="mt-2 text-sm text-ink/70 max-w-xl">
          Capture priorities, track momentum, and keep the quiet tasks from slipping through.
        </p>
      </div>
      <div className="gradient-panel ink-shadow rounded-3xl px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-ocean text-white">
            <FiCheckCircle className="text-2xl" />
          </div>
          <div>
            <p className="text-sm text-ink/70">Completion rate</p>
            <p className="text-2xl font-semibold text-ink">
              {Math.round((stats.completion_rate || 0) * 100)}%
            </p>
            <p className="text-xs text-ink/60">
              {stats.completed} done · {stats.pending} open
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white/70 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/10 text-sm font-semibold text-ink">
            {name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-sm text-ink/70">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Signed in</p>
            <p className="font-semibold text-ink">{name}</p>
          </div>
          <button
            type="button"
            onClick={onChangeName}
            className="ml-auto rounded-full border border-ink/20 px-3 py-1 text-xs font-semibold text-ink/60 transition hover:border-ink/40"
          >
            Change
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
