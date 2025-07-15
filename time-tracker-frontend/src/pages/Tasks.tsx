import { useEffect, useState } from "react";
import TaskList from "@/components/Tasks/TaskList";
import { tasks as mockTasks } from "@/components/Tasks/mockTasks";
import type { Task } from "@/types/tasks";
import AddTask from "@/components/Tasks/AddTask";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(mockTasks);
  }, []);

  return (
    <div>
      <div className="text-3xl font-bold">Tasks</div>
      <AddTask />
      <TaskList tasks={tasks} />
    </div>
  );
}
