import TaskItem from "./TaskItem";

const TaskList = ({ tasks, loading, onToggle, onEdit, onRequestDelete }) => {
  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 rounded-3xl border border-ink/10 bg-white/70 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="rounded-3xl border border-dashed border-ink/20 bg-white/60 p-8 text-center">
        <p className="text-sm text-ink/60">No tasks match this view yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onEdit={(payload) => onEdit(task.id, payload)}
          onRequestDelete={() => onRequestDelete(task)}
        />
      ))}
    </div>
  );
};

export default TaskList;
