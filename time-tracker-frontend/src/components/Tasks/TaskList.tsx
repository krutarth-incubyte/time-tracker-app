import type { Task } from "../../types/tasks";

export default function TaskList({ tasks = [] }: { tasks: Task[] }) {
  return (
    // TODO: make it a grid
    <div className="flex gap-2">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task.id} className="flex flex-col gap-2">
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>{task.createdAt.toLocaleDateString()}</p>
            <p>{task.status}</p>
          </div>
        ))
      ) : (
        <div>No tasks found</div>
      )}
    </div>
  );
}
