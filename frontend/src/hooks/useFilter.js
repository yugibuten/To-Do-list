import { useCallback, useState } from "react";

export const useFilter = () => {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");

  const applyFilter = useCallback(
    (tasks) => {
      return tasks;
    },
    []
  );

  return {
    status,
    setStatus,
    search,
    setSearch,
    category,
    setCategory,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    applyFilter
  };
};
