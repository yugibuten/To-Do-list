import { useState } from "react";
import { FiCheck, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from "../constants";
import { formatDate, formatDateTime, isOverdue } from "../utils/formatDate";
import { validateTask } from "../utils/validation";

const priorityStyles = {
  low: "bg-moss/10 text-moss",
  medium: "bg-ocean/10 text-ocean",
  high: "bg-ember/10 text-ember"
};

const TaskItem = ({ task, onToggle, onEdit, onRequestDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority || "medium",
    due_date: task.due_date ? task.due_date.slice(0, 10) : "",
    category: task.category || "",
    completed: task.completed
  });
  const [error, setError] = useState("");

  const updateField = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = async () => {
    const validationError = validateTask(formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    await onEdit({
      ...formData,
      due_date: formData.due_date || null,
      category: formData.category || null
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
      due_date: task.due_date ? task.due_date.slice(0, 10) : "",
      category: task.category || "",
      completed: task.completed
    });
    setError("");
    setIsEditing(false);
  };

  return (
    <div className="rounded-3xl border border-ink/10 bg-white/80 p-5 shadow-lift transition hover:-translate-y-0.5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onToggle}
            className={`mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center transition ${
              task.completed ? "border-moss bg-moss text-white" : "border-ink/30"
            }`}
            aria-label="Toggle completion"
          >
            {task.completed ? <FiCheck className="text-sm" /> : null}
          </button>
          <div className="flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={formData.title}
                  onChange={updateField("title")}
                  className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/60"
                />
                <textarea
                  value={formData.description}
                  onChange={updateField("description")}
                  rows={2}
                  className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/60"
                />
                <div className="grid gap-3 md:grid-cols-3">
                  <select
                    value={formData.priority}
                    onChange={updateField("priority")}
                    className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/60"
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={updateField("due_date")}
                    className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/60"
                  />
                  <select
                    value={formData.category}
                    onChange={updateField("category")}
                    className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/60"
                  >
                    <option value="">No category</option>
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {error ? <p className="text-xs text-ember">{error}</p> : null}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
                  >
                    <FiCheck />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold text-ink/70"
                  >
                    <FiX />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3
                  className={`text-lg font-semibold text-ink ${
                    task.completed ? "line-through text-ink/40" : ""
                  }`}
                >
                  {task.title}
                </h3>
                {task.description ? (
                  <p className="text-sm text-ink/70 mt-1">{task.description}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full px-3 py-1 ${priorityStyles[task.priority] || "bg-ink/10 text-ink"}`}>
                    {task.priority ? `${task.priority} priority` : "no priority"}
                  </span>
                  {task.category ? (
                    <span className="rounded-full bg-ink/10 px-3 py-1 text-ink">
                      {task.category}
                    </span>
                  ) : null}
                  {task.due_date ? (
                    <span
                      className={`rounded-full px-3 py-1 ${
                        isOverdue(task.due_date) && !task.completed
                          ? "bg-ember/10 text-ember"
                          : "bg-ink/10 text-ink/70"
                      }`}
                    >
                      due {formatDate(task.due_date)}
                    </span>
                  ) : null}
                  <span className="text-ink/50">created {formatDateTime(task.created_at)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        {!isEditing ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold text-ink/70 transition hover:border-ink/40"
            >
              <FiEdit2 />
              Edit
            </button>
            <button
              type="button"
              onClick={onRequestDelete}
              className="inline-flex items-center gap-2 rounded-full border border-ember/20 px-4 py-2 text-xs font-semibold text-ember transition hover:border-ember/60"
            >
              <FiTrash2 />
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TaskItem;
