import { useEffect, useRef } from "react";
import { FiAlertCircle } from "react-icons/fi";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirm delete"
        className="gradient-panel ink-shadow w-full max-w-md rounded-3xl p-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ember/10 text-ember">
            <FiAlertCircle />
          </span>
          <h3 className="text-lg font-semibold text-ink">Confirm action</h3>
        </div>
        <p className="mt-3 text-sm text-ink/70">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            ref={cancelRef}
            className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink/70"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
