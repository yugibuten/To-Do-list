import { FiSearch } from "react-icons/fi";

const SearchBar = ({ value, onChange, inputRef }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white/80 px-4 py-3">
      <FiSearch className="text-ink/50" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search tasks"
        ref={inputRef}
        aria-label="Search tasks"
        className="w-full bg-transparent text-sm text-ink focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
