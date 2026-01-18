export const API_BASE_URL = "http://localhost:8000/api";

export const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending" }
];

export const PRIORITY_OPTIONS = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" }
];

export const CATEGORY_OPTIONS = [
  "Work",
  "Personal",
  "Shopping",
  "Health",
  "Learning",
  "Home"
];

export const SORT_OPTIONS = [
  { id: "created_at", label: "Created" },
  { id: "priority", label: "Priority" },
  { id: "due_date", label: "Due date" },
  { id: "title", label: "Title" }
];
