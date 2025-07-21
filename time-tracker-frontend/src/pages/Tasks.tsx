import TaskList from "@/components/Tasks/TaskList";
import { AddTaskSchema } from "@/types/tasks";
import AddTask from "@/components/Tasks/AddTask";
import { useTasks, useCreateTask } from "@/hooks/useTasks";

export default function Tasks() {
  const { data: tasks = [], isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();

  function addTask(task: AddTaskSchema) {
    createTaskMutation.mutate(task);
  }

  if (isLoading) {
    return (
      <div>
        <div className="text-3xl font-bold">Tasks</div>
        <div>Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="text-3xl font-bold">Tasks</div>
        <div className="text-red-500">
          Error loading tasks:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-3xl font-bold">Tasks</div>
      <AddTask addTaskHandler={addTask} />
      {createTaskMutation.isPending && <div>Adding task...</div>}
      {createTaskMutation.error && (
        <div className="text-red-500">
          Error adding task:{" "}
          {createTaskMutation.error instanceof Error
            ? createTaskMutation.error.message
            : "Unknown error"}
        </div>
      )}
      <TaskList tasks={tasks} />
    </div>
  );
}
