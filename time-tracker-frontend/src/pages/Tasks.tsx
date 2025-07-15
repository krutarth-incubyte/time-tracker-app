import TaskList from "../components/Tasks/TaskList";
import { tasks } from "../components/Tasks/mockTasks";

export default function Tasks() {
  return (
    <div>
      <TaskList tasks={tasks} />
    </div>
  );
}
