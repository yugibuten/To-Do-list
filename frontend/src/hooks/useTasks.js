import { useCallback, useEffect, useState } from "react";

import {
  createTask,
  deleteTask,
  fetchTaskStats,
  fetchTasks,
  toggleTask,
  updateTask
} from "../services/api";

export const useTasks = ({ status, category, search, sortBy, sortDir }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completion_rate: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [tasksData, statsData] = await Promise.all([
        fetchTasks({ status, category, search, sortBy, sortDir }),
        fetchTaskStats()
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      setError("Unable to load tasks right now.");
    } finally {
      setLoading(false);
    }
  }, [status, category, search, sortBy, sortDir]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async (payload) => {
    try {
      const created = await createTask(payload);
      setTasks((prev) => [created, ...prev]);
      loadTasks();
      return created;
    } catch (err) {
      throw err;
    }
  };

  const editTask = async (id, payload) => {
    const previous = tasks;
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...payload } : task))
    );
    try {
      const updated = await updateTask(id, payload);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
      loadTasks();
      return updated;
    } catch (err) {
      setTasks(previous);
      throw err;
    }
  };

  const toggleTaskStatus = async (id) => {
    const previous = tasks;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
      loadTasks();
      return updated;
    } catch (err) {
      setTasks(previous);
      throw err;
    }
  };

  const removeTask = async (id) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((task) => task.id !== id));
    try {
      await deleteTask(id);
      loadTasks();
    } catch (err) {
      setTasks(previous);
      throw err;
    }
  };


  return {
    tasks,
    stats,
    loading,
    error,
    loadTasks,
    addTask,
    editTask,
    toggleTaskStatus,
    removeTask
  };
};
