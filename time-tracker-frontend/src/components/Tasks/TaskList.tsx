import type { Task } from "../../types/tasks";

export default function TaskList({ tasks }: { tasks?: Task[] }) {
  return (
    <div>
      <h1>Task List</h1>
      {tasks?.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
