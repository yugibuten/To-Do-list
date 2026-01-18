import { CATEGORY_OPTIONS } from "../constants";

const CategoryFilter = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("")}
        aria-pressed={value === ""}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          value === ""
            ? "bg-ink text-white"
            : "border border-ink/20 text-ink/60 hover:border-ink/40"
        }`}
      >
        All categories
      </button>
      {CATEGORY_OPTIONS.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          aria-pressed={value === category}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            value === category
              ? "bg-ocean text-white"
              : "border border-ink/20 text-ink/60 hover:border-ink/40"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
