import { useState } from "react";
import { FiPlus, FiRefreshCw } from "react-icons/fi";

import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from "../constants";
import { validateTask } from "../utils/validation";

const initialState = {
  title: "",
  description: "",
  priority: "medium",
  due_date: "",
  category: ""
};

const TaskInput = ({ onAdd }) => {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateTask(formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onAdd({
        ...formData,
        due_date: formData.due_date || null,
        category: formData.category || null
      });
      setFormData(initialState);
    } catch (err) {
      setError("Could not add task. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData(initialState);
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="gradient-panel ink-shadow rounded-3xl p-6 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">Task title</label>
        <input
          type="text"
          value={formData.title}
          onChange={updateField("title")}
          placeholder="Ship the new onboarding"
          className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/60"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">Description</label>
        <textarea
          value={formData.description}
          onChange={updateField("description")}
          placeholder="Optional notes or context"
          rows={3}
          className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/60"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ink">Priority</label>
          <select
            value={formData.priority}
            onChange={updateField("priority")}
            className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/60"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ink">Due date</label>
          <input
            type="date"
            value={formData.due_date}
            onChange={updateField("due_date")}
            className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/60"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ink">Category</label>
          <select
            value={formData.category}
            onChange={updateField("category")}
            className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/60"
          >
            <option value="">No category</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error ? <p className="text-sm text-ember">{error}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={!formData.title.trim() || submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/40"
        >
          <FiPlus />
          {submitting ? "Adding..." : "Add task"}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-5 py-3 text-sm font-semibold text-ink/70 transition hover:-translate-y-0.5 hover:border-ink/40"
        >
          <FiRefreshCw />
          Clear
        </button>
      </div>
    </form>
  );
};

export default TaskInput;
