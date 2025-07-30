import type { Task } from "../../types/tasks";
import { TaskStatus } from "../../types/tasks";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Edit,
  Trash2,
  Clock,
  Calendar,
  Plus,
  ChevronRight,
} from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onAddSubTask?: (parentTask: Task) => void;
}

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

export default function TaskList({
  tasks = [],
  onEditTask,
  onDeleteTask,
  onAddSubTask,
}: TaskListProps) {
  const navigate = useNavigate();

  // Separate tasks into parents and children
  const topLevelTasks = tasks.filter((task) => !task.parentTaskId);
  const subTasks = tasks.filter((task) => task.parentTaskId);

  // Group sub-tasks by parent
  const subTasksByParent = subTasks.reduce((acc, task) => {
    if (task.parentTaskId) {
      if (!acc[task.parentTaskId]) {
        acc[task.parentTaskId] = [];
      }
      acc[task.parentTaskId].push(task);
    }
    return acc;
  }, {} as Record<number, Task[]>);

  const handleTaskClick = (taskId: number, event: React.MouseEvent) => {
    // Don't navigate if clicking on edit/delete buttons
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }
    navigate(`/tasks/${taskId}`);
  };

  // Render a task card
  const renderTaskCard = (task: Task, isSubTask = false) => (
    <div
      key={task.id}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 cursor-pointer group ${
        isSubTask ? "ml-4 border-l-4 border-l-blue-200" : ""
      }`}
      onClick={(e) => handleTaskClick(task.id, e)}
    >
      <div className="p-6">
        {/* Header with title and actions */}
        <div className="flex justify-between items-start mb-4">
          <h3
            className={`text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors ${
              isSubTask ? "text-base" : ""
            }`}
          >
            {isSubTask && (
              <ChevronRight className="w-4 h-4 inline mr-1 text-blue-500" />
            )}
            {task.title}
          </h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isSubTask && onAddSubTask && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSubTask(task);
                }}
                className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
                title="Add Sub-task"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
            {onEditTask && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask(task);
                }}
                className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDeleteTask && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task);
                }}
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {task.description}
          </p>
        )}

        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              task.status
            )}`}
          >
            {getStatusText(task.status)}
          </span>
        </div>

        {/* Created Date and Sub-task count */}
        <div className="flex items-center justify-between text-gray-500 text-xs">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Created {task.createdAt.toLocaleDateString()}
          </div>
          {!isSubTask && subTasksByParent[task.id] && (
            <div className="text-blue-600 font-medium">
              {subTasksByParent[task.id].length} sub-task
              {subTasksByParent[task.id].length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Hover indicator */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-b-lg"></div>
    </div>
  );

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-500">
          Create your first task to get started with time tracking
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {topLevelTasks.map((task) => (
        <div key={task.id} className="space-y-2">
          {renderTaskCard(task)}
          {/* Render sub-tasks */}
          {subTasksByParent[task.id] && (
            <div className="space-y-2">
              {subTasksByParent[task.id].map((subTask) =>
                renderTaskCard(subTask, true)
              )}
            </div>
          )}
        </div>
      ))}

      {/* Show orphaned sub-tasks (sub-tasks whose parent is not in the current list) */}
      {subTasks
        .filter(
          (subTask) =>
            !topLevelTasks.find((parent) => parent.id === subTask.parentTaskId)
        )
        .map((orphanedSubTask) => (
          <div key={orphanedSubTask.id} className="space-y-2">
            {renderTaskCard(orphanedSubTask, true)}
          </div>
        ))}
    </div>
  );
}
