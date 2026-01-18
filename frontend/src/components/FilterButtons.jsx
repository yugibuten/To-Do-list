import { STATUS_FILTERS } from "../constants";

const FilterButtons = ({ active, onChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {STATUS_FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onChange(filter.id)}
          aria-pressed={active === filter.id}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === filter.id
              ? "bg-ink text-white"
              : "border border-ink/20 text-ink/70 hover:border-ink/40"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
