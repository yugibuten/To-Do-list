export const validateTask = ({ title }) => {
  if (!title || !title.trim()) {
    return "Title is required.";
  }
  if (title.trim().length > 255) {
    return "Title must be 255 characters or less.";
  }
  return "";
};
