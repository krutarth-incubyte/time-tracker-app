import { useEffect, useState } from "react";
import TaskList from "@/components/Tasks/TaskList";
import { tasks as mockTasks } from "@/components/Tasks/mockTasks";
import { Task, AddTaskSchema, TaskStatus } from "@/types/tasks";
import AddTask from "@/components/Tasks/AddTask";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(mockTasks);
  }, []);

  function addTask(task: AddTaskSchema) {
    setTasks([
      ...tasks,
      {
        id: tasks.length + 1,
        title: task.taskName,
        description: task.taskDescription,
        createdAt: new Date(),
        status: TaskStatus.PENDING,
      } as Task,
    ]);
  }

  return (
    <div>
      <div className="text-3xl font-bold">Tasks</div>
      <AddTask addTaskHandler={addTask} />
      <TaskList tasks={tasks} />
    </div>
  );
}
