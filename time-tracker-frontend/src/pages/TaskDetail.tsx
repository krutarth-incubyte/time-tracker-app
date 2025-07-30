import AddTimeblock from "@/components/Timeblocks/AddTimeblock";
import TimeblockList from "@/components/Timeblocks/TimeblockList";
import AddEditTask from "@/components/Tasks/AddEditTask";
import TaskList from "@/components/Tasks/TaskList";
import { DeleteConfirmation } from "@/components/ui/delete-confirmation";
import { AddTimeblockSchema, Timeblock } from "@/types/timeblocks";
import {
  AddTaskSchema,
  Task,
  TaskStatus,
  UpdateTaskSchema,
} from "@/types/tasks";
import { useParams, useNavigate } from "react-router-dom";
import {
  useTimeblocksForTask,
  useCreateTimeblock,
  useDeleteTimeblock,
} from "@/hooks/useTimeblocks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetTask,
  useUpdateTask,
  useSubTasks,
  useCreateTask,
  useDeleteTask,
} from "@/hooks/useTasks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, Timer, Plus, Users } from "lucide-react";

export default function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const taskIdNum = Number(taskId);
  const { data: task } = useGetTask(taskIdNum);

  const {
    data: timeblocks = [],
    isLoading,
    error,
  } = useTimeblocksForTask(taskIdNum);
  const createTimeblockMutation = useCreateTimeblock();
  const deleteTimeblockMutation = useDeleteTimeblock();
  const updateTaskMutation = useUpdateTask();

  // Subtasks data and mutations
  const { data: subtasks = [] } = useSubTasks(taskIdNum);
  const createTaskMutation = useCreateTask();
  const deleteTaskMutation = useDeleteTask();

  // State for delete confirmation
  const [deletingTimeblock, setDeletingTimeblock] = useState<Timeblock | null>(
    null
  );
  const [deletingSubtask, setDeletingSubtask] = useState<Task | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<Task | null>(null);

  function addTimeblock(timeblock: AddTimeblockSchema) {
    createTimeblockMutation.mutate(timeblock);
  }

  function handleStatusChange(status: string) {
    updateTaskMutation.mutate({
      id: taskIdNum,
      data: { status: status as UpdateTaskSchema["status"] },
    });
  }

  function handleDeleteTimeblock(timeblock: Timeblock) {
    setDeletingTimeblock(timeblock);
  }

  function confirmDeleteTimeblock() {
    if (deletingTimeblock) {
      deleteTimeblockMutation.mutate(deletingTimeblock.id);
      setDeletingTimeblock(null);
    }
  }

  function handleAddSubtask(subtaskData: AddTaskSchema) {
    createTaskMutation.mutate({
      ...subtaskData,
      parentTaskId: taskIdNum,
    });
  }

  function handleEditSubtask(subtaskId: number, data: UpdateTaskSchema) {
    updateTaskMutation.mutate({ id: subtaskId, data });
    setEditingSubtask(null);
  }

  function handleDeleteSubtask(subtask: Task) {
    setDeletingSubtask(subtask);
  }

  function confirmDeleteSubtask() {
    if (deletingSubtask) {
      deleteTaskMutation.mutate(deletingSubtask.id);
      setDeletingSubtask(null);
    }
  }

  // Calculate total time
  const totalTime = timeblocks.reduce((total, timeblock) => {
    const start = new Date(timeblock.start);
    const end = new Date(timeblock.end);
    return total + (end.getTime() - start.getTime());
  }, 0);

  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case TaskStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case TaskStatus.COMPLETED:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case TaskStatus.PENDING:
        return "Pending";
      case TaskStatus.IN_PROGRESS:
        return "In Progress";
      case TaskStatus.COMPLETED:
        return "Completed";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Loading task details...
              </h2>
              <p className="text-gray-600">
                Please wait while we fetch your task information
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
                Error Loading Task
              </h2>
              <p className="text-red-700">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </p>
              <Button
                onClick={() => navigate("/tasks")}
                className="mt-4"
                variant="outline"
              >
                Back to Tasks
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Task not found
            </h2>
            <p className="text-gray-600 mb-4">
              The task you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/tasks")}>Back to Tasks</Button>
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
          <Button
            variant="ghost"
            onClick={() => navigate("/tasks")}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tasks
          </Button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {task.title}
                </h1>
                {task.description && (
                  <p className="text-gray-600 mb-4">{task.description}</p>
                )}
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {getStatusText(task.status)}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created {task.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700">
                Update Status:
              </label>
              <Select value={task.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskStatus.PENDING}>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      Pending
                    </span>
                  </SelectItem>
                  <SelectItem value={TaskStatus.IN_PROGRESS}>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      In Progress
                    </span>
                  </SelectItem>
                  <SelectItem value={TaskStatus.COMPLETED}>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Completed
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Time Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Total Time Tracked
            </div>
            <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Timer className="w-6 h-6 text-blue-600" />
              {formatDuration(totalTime)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Time Blocks
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {timeblocks.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Average Session
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {timeblocks.length > 0
                ? formatDuration(totalTime / timeblocks.length)
                : "0h 0m"}
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {(createTimeblockMutation.isPending ||
          deleteTimeblockMutation.isPending ||
          updateTaskMutation.isPending ||
          createTaskMutation.isPending ||
          deleteTaskMutation.isPending) && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-blue-800">
                {createTimeblockMutation.isPending && "Adding timeblock..."}
                {deleteTimeblockMutation.isPending && "Deleting timeblock..."}
                {updateTaskMutation.isPending && "Updating task..."}
                {createTaskMutation.isPending && "Adding subtask..."}
                {deleteTaskMutation.isPending && "Deleting subtask..."}
              </span>
            </div>
          </div>
        )}

        {(createTimeblockMutation.error ||
          deleteTimeblockMutation.error ||
          updateTaskMutation.error ||
          createTaskMutation.error ||
          deleteTaskMutation.error) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800">
              {createTimeblockMutation.error &&
                `Error adding timeblock: ${createTimeblockMutation.error.message}`}
              {deleteTimeblockMutation.error &&
                `Error deleting timeblock: ${deleteTimeblockMutation.error.message}`}
              {updateTaskMutation.error &&
                `Error updating task: ${updateTaskMutation.error.message}`}
              {createTaskMutation.error &&
                `Error adding subtask: ${createTaskMutation.error.message}`}
              {deleteTaskMutation.error &&
                `Error deleting subtask: ${deleteTaskMutation.error.message}`}
            </div>
          </div>
        )}

        {/* Subtasks Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Subtasks
              {subtasks.length > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({subtasks.length})
                </span>
              )}
            </h2>
            <AddEditTask onAddTask={handleAddSubtask} parentTask={task}>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Subtask
              </Button>
            </AddEditTask>
          </div>

          {subtasks.length > 0 ? (
            <TaskList
              tasks={subtasks}
              onEditTask={setEditingSubtask}
              onDeleteTask={handleDeleteSubtask}
              onAddSubTask={() => {}} // Disabled for nested subtasks
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No subtasks yet</p>
              <p className="text-sm">
                Break down this task into smaller, manageable subtasks
              </p>
            </div>
          )}
        </div>

        {/* Timeblocks Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Time Blocks
            </h2>
            <AddTimeblock
              taskId={taskIdNum}
              addTimeblockHandler={addTimeblock}
            />
          </div>

          <TimeblockList
            timeblocks={timeblocks}
            onDeleteTimeblock={handleDeleteTimeblock}
          />
        </div>

        {/* Delete Timeblock Confirmation Dialog */}
        <DeleteConfirmation
          open={!!deletingTimeblock}
          onOpenChange={(open) => !open && setDeletingTimeblock(null)}
          onConfirm={confirmDeleteTimeblock}
          title="Delete Time Block"
          description={
            deletingTimeblock
              ? `Are you sure you want to delete this time block? This action cannot be undone.`
              : ""
          }
          isLoading={deleteTimeblockMutation.isPending}
        />

        {/* Delete Subtask Confirmation Dialog */}
        <DeleteConfirmation
          open={!!deletingSubtask}
          onOpenChange={(open) => !open && setDeletingSubtask(null)}
          onConfirm={confirmDeleteSubtask}
          title="Delete Subtask"
          description={
            deletingSubtask
              ? `Are you sure you want to delete "${deletingSubtask.title}"? This action cannot be undone and will also delete all associated time blocks.`
              : ""
          }
          isLoading={deleteTaskMutation.isPending}
        />

        {/* Edit Subtask Dialog */}
        {editingSubtask && (
          <AddEditTask
            task={editingSubtask}
            onEditTask={handleEditSubtask}
            open={!!editingSubtask}
            onOpenChange={(open) => !open && setEditingSubtask(null)}
          />
        )}
      </div>
    </div>
  );
}
