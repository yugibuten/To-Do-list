const Toast = ({ message, type = "info", onClose }) => {
  const styles = {
    success: "bg-moss/10 text-moss border-moss/30",
    error: "bg-ember/10 text-ember border-ember/30",
    info: "bg-ocean/10 text-ocean border-ocean/30"
  };

  return (
    <div
      role="status"
      className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-sm shadow-lift ${
        styles[type] || styles.info
      }`}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="text-xs font-semibold uppercase tracking-[0.15em]"
        aria-label="Dismiss notification"
      >
        Close
      </button>
    </div>
  );
};

export default Toast;
