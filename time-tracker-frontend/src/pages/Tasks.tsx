import TaskList from "../components/Tasks/TaskList";
import { tasks } from "../components/Tasks/mockTasks";

export default function Tasks() {
  return (
    <div>
      <div className="text-3xl font-bold">Tasks</div>
      <TaskList tasks={tasks} />
    </div>
  );
}
