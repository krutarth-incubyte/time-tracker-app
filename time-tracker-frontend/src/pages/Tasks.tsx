import TaskList from "@/components/Tasks/TaskList";
import AddEditTask from "@/components/Tasks/AddEditTask";
import { DeleteConfirmation } from "@/components/ui/delete-confirmation";
import { AddTaskSchema, Task, UpdateTaskSchema } from "@/types/tasks";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/useTasks";
import { useState } from "react";
import { Clock } from "lucide-react";

export default function Tasks() {
  const { data: tasks = [], isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // State for edit and delete dialogs
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [parentTaskForSubTask, setParentTaskForSubTask] = useState<Task | null>(
    null
  );

  function handleAddTask(taskData: AddTaskSchema) {
    createTaskMutation.mutate(taskData);
  }

  function handleEditTask(taskId: number, data: UpdateTaskSchema) {
    updateTaskMutation.mutate({ id: taskId, data });
    setEditingTask(null);
  }

  function handleDeleteTask(task: Task) {
    setDeletingTask(task);
  }

  function handleAddSubTask(parentTask: Task) {
    setParentTaskForSubTask(parentTask);
  }

  function confirmDeleteTask() {
    if (deletingTask) {
      deleteTaskMutation.mutate(deletingTask.id);
      setDeletingTask(null);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Loading tasks...
              </h2>
              <p className="text-gray-600">
                Please wait while we fetch your tasks
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-red-900 mb-2">
                Error Loading Tasks
              </h2>
              <p className="text-red-700">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-600" />
                Time Tracker
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your tasks and track your time efficiently
              </p>
            </div>
            <AddEditTask onAddTask={handleAddTask} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Total Tasks
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {tasks.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">
              In Progress
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter((task) => task.status === "in_progress").length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Completed
            </div>
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter((task) => task.status === "completed").length}
            </div>
          </div>
        </div>

        {/* Loading States */}
        {(createTaskMutation.isPending ||
          updateTaskMutation.isPending ||
          deleteTaskMutation.isPending) && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-blue-800">
                {createTaskMutation.isPending && "Adding task..."}
                {updateTaskMutation.isPending && "Updating task..."}
                {deleteTaskMutation.isPending && "Deleting task..."}
              </span>
            </div>
          </div>
        )}

        {/* Error States */}
        {(createTaskMutation.error ||
          updateTaskMutation.error ||
          deleteTaskMutation.error) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800">
              {createTaskMutation.error &&
                `Error adding task: ${createTaskMutation.error.message}`}
              {updateTaskMutation.error &&
                `Error updating task: ${updateTaskMutation.error.message}`}
              {deleteTaskMutation.error &&
                `Error deleting task: ${deleteTaskMutation.error.message}`}
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
            {tasks.length > 0 && (
              <span className="text-sm text-gray-500">
                {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
              </span>
            )}
          </div>

          <TaskList
            tasks={tasks}
            onEditTask={setEditingTask}
            onDeleteTask={handleDeleteTask}
            onAddSubTask={handleAddSubTask}
          />
        </div>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmation
          open={!!deletingTask}
          onOpenChange={(open) => !open && setDeletingTask(null)}
          onConfirm={confirmDeleteTask}
          title="Delete Task"
          description={
            deletingTask
              ? `Are you sure you want to delete "${deletingTask.title}"? This action cannot be undone and will also delete all associated time blocks.`
              : ""
          }
          isLoading={deleteTaskMutation.isPending}
        />
      </div>
    </div>
  );
}
