import type { Task } from "../../types/tasks";
import { useNavigate } from "react-router-dom";

export default function TaskList({ tasks = [] }: { tasks: Task[] }) {
  const navigate = useNavigate();
  const handleTaskClick = (taskId: number) => {
    navigate(`/timeblocks/${taskId}`);
  };
  return (
    // TODO: make it a grid
    <div className="flex gap-2">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col gap-2 border-2 border-gray-300 rounded-md p-2 cursor-pointer"
            onClick={() => handleTaskClick(task.id)}
          >
            <div className="text-lg font-bold">{task.title}</div>
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
