import { useEffect, useMemo, useRef, useState } from "react";

import CategoryFilter from "./components/CategoryFilter";
import ConfirmModal from "./components/ConfirmModal";
import FilterButtons from "./components/FilterButtons";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Toast from "./components/Toast";
import { useFilter } from "./hooks/useFilter";
import { useTasks } from "./hooks/useTasks";
import { useDebounce } from "./hooks/useDebounce";
import { SORT_OPTIONS } from "./constants";

const App = () => {
  const [name, setName] = useState(() => localStorage.getItem("todo_name") || "");
  const [pendingName, setPendingName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState("");
  const [toasts, setToasts] = useState([]);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const searchRef = useRef(null);
  const filter = useFilter();
  const debouncedSearch = useDebounce(filter.search, 400);
  const { tasks, stats, loading, error, addTask, editTask, toggleTaskStatus, removeTask } =
    useTasks({
      status: filter.status,
      category: filter.category,
      search: debouncedSearch,
      sortBy: filter.sortBy,
      sortDir: filter.sortDir
    });

  const visibleTasks = useMemo(() => filter.applyFilter(tasks), [filter, tasks]);

  useEffect(() => {
    const handleKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!name) return;
    const message = `Hi ${name}`;
    setGreeting("");
    setIsTyping(true);
    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setGreeting(message.slice(0, index));
      if (index >= message.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [name]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const handleNameSubmit = (event) => {
    event.preventDefault();
    const trimmed = pendingName.trim();
    if (!trimmed) return;
    setName(trimmed);
    localStorage.setItem("todo_name", trimmed);
    setPendingName("");
  };

  const handleChangeName = () => {
    localStorage.removeItem("todo_name");
    setName("");
    setGreeting("");
    setPendingName("");
  };

  const handleAdd = async (payload) => {
    try {
      await addTask(payload);
      setNotification("Task added successfully.");
      setTimeout(() => setNotification(""), 2000);
      addToast("Task created.", "success");
    } catch (err) {
      addToast("Failed to add task. Try again.", "error");
    }
  };

  const handleEdit = async (id, payload) => {
    try {
      await editTask(id, payload);
      setNotification("Task updated.");
      setTimeout(() => setNotification(""), 2000);
      addToast("Task updated.", "success");
    } catch (err) {
      addToast("Update failed. Changes reverted.", "error");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleTaskStatus(id);
    } catch (err) {
      addToast("Toggle failed. Changes reverted.", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await removeTask(taskToDelete.id);
      setTaskToDelete(null);
      setNotification("Task deleted.");
      setTimeout(() => setNotification(""), 2000);
      addToast("Task deleted.", "success");
    } catch (err) {
      setTaskToDelete(null);
      addToast("Delete failed. Task restored.", "error");
    }
  };

  if (!name) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="gradient-panel ink-shadow w-full max-w-lg rounded-3xl p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-ink/60">Welcome in</p>
          <h1 className="text-title mt-2 text-3xl text-ink">What should we call you?</h1>
          <p className="mt-2 text-sm text-ink/70">
            Enter your name to personalize your workspace.
          </p>
          <form onSubmit={handleNameSubmit} className="mt-6 flex flex-col gap-4">
            <input
              type="text"
              value={pendingName}
              onChange={(event) => setPendingName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/60"
            />
            <button
              type="submit"
              disabled={!pendingName.trim()}
              className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/40"
            >
              Enter workspace
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 md:px-10">
      <Header
        stats={stats}
        greeting={greeting}
        isTyping={isTyping}
        name={name}
        onChangeName={handleChangeName}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-6">
          <TaskInput onAdd={handleAdd} />
          <div className="gradient-panel ink-shadow rounded-3xl p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-ink">Find your focus</h2>
            <SearchBar value={filter.search} onChange={filter.setSearch} inputRef={searchRef} />
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Status</p>
              <FilterButtons active={filter.status} onChange={filter.setStatus} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Category</p>
              <CategoryFilter value={filter.category} onChange={filter.setCategory} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Sort</p>
              <div className="grid gap-3 md:grid-cols-2">
                <select
                  value={filter.sortBy}
                  onChange={(event) => filter.setSortBy(event.target.value)}
                  className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/60"
                  aria-label="Sort tasks by"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={filter.sortDir}
                  onChange={(event) => filter.setSortDir(event.target.value)}
                  className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/60"
                  aria-label="Sort direction"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
            <div className="text-xs text-ink/60">
              {tasks.length} tasks · {stats.completed} completed
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ink">Task stream</h2>
            {notification ? (
              <span className="rounded-full bg-moss/10 px-3 py-1 text-xs font-semibold text-moss">
                {notification}
              </span>
            ) : null}
          </div>
          {error ? (
            <div className="rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember">
              {error}
            </div>
          ) : null}
          <TaskList
            tasks={visibleTasks}
            loading={loading}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onRequestDelete={setTaskToDelete}
          />
        </div>
      </div>
      {taskToDelete ? (
        <ConfirmModal
          message={`Delete \"${taskToDelete.title}\"? This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      ) : null}
      {toasts.length ? (
        <div
          className="fixed right-6 top-6 z-50 flex w-[min(360px,90vw)] flex-col gap-3"
          aria-live="polite"
        >
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default App;
