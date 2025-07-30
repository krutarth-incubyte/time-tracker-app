import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { XIcon, Plus, Edit } from "lucide-react";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddTaskSchema,
  Task,
  TaskStatus,
  UpdateTaskSchema,
} from "@/types/tasks";
import { useTasks } from "@/hooks/useTasks";

const taskSchema = z.object({
  title: z.string().min(1, { message: "Task name is required" }),
  description: z.string(),
  status: z
    .enum([TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED])
    .optional(),
  parentTaskId: z.number().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface AddEditTaskProps {
  task?: Task; // If provided, we're editing; if not, we're adding
  onAddTask?: (task: AddTaskSchema) => void;
  onEditTask?: (taskId: number, data: UpdateTaskSchema) => void;
  children?: React.ReactNode; // Custom trigger
  open?: boolean; // External control of dialog open state
  onOpenChange?: (open: boolean) => void; // External control of dialog open state
  parentTask?: Task; // If provided, creating a sub-task
}

export default function AddEditTask({
  task,
  onAddTask,
  onEditTask,
  children,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  parentTask,
}: AddEditTaskProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isEditing = !!task;

  // Use external open state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  // Get all tasks for parent task selector (only when not editing and not creating sub-task)
  const { data: allTasks = [] } = useTasks();

  // Filter out the current task and its descendants from parent options
  const availableParentTasks = allTasks.filter(
    (t) => t.id !== task?.id && !t.parentTaskId // Only show top-level tasks for now
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.PENDING,
      parentTaskId: parentTask?.id,
    },
  });

  const watchedStatus = watch("status");
  const watchedParentTaskId = watch("parentTaskId");

  // Reset form when task changes or dialog opens
  useEffect(() => {
    if (isEditing && task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        parentTaskId: task.parentTaskId,
      });
    } else {
      reset({
        title: "",
        description: "",
        status: TaskStatus.PENDING,
        parentTaskId: parentTask?.id,
      });
    }
  }, [task, isEditing, reset, open, parentTask]);

  function onSubmit(data: TaskFormData) {
    if (isEditing && task && onEditTask) {
      onEditTask(task.id, {
        title: data.title,
        description: data.description,
        status: data.status,
        parentTaskId: data.parentTaskId,
      });
    } else if (!isEditing && onAddTask) {
      onAddTask({
        title: data.title,
        description: data.description,
        parentTaskId: data.parentTaskId,
      });
    }
    setOpen(false);
  }

  const defaultTrigger = isEditing ? (
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
      <Edit className="w-4 h-4" />
    </Button>
  ) : (
    <Button className="flex items-center gap-2">
      <Plus className="w-4 h-4" />
      Add Task
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
      <DialogContent
        data-testid={isEditing ? "edit-task-dialog" : "add-task-dialog"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Edit className="w-5 h-5" />
                  Edit Task
                </>
              ) : parentTask ? (
                <>
                  <Plus className="w-5 h-5" />
                  Add Sub-task
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add New Task
                </>
              )}
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                data-testid="close-button"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            {/* Task Name */}
            <div className="space-y-2">
              <label htmlFor="task-name" className="text-sm font-medium">
                Task Name *
              </label>
              <Input
                type="text"
                placeholder="Enter task name"
                id="task-name"
                data-testid="task-name-input"
                {...register("title")}
              />
              {errors.title && (
                <p
                  className="text-red-500 text-sm"
                  data-testid="task-name-error"
                >
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Task Description */}
            <div className="space-y-2">
              <label htmlFor="task-description" className="text-sm font-medium">
                Description
              </label>
              <Input
                type="text"
                placeholder="Enter task description (optional)"
                id="task-description"
                data-testid="task-description-input"
                {...register("description")}
              />
            </div>

            {/* Parent Task Selector (show when not editing or when editing and current task can have a parent) */}
            {(!isEditing || (isEditing && !parentTask)) && (
              <div className="space-y-2">
                <label htmlFor="parent-task" className="text-sm font-medium">
                  Parent Task
                </label>
                <Select
                  value={watchedParentTaskId?.toString() || "none"}
                  onValueChange={(value) =>
                    setValue(
                      "parentTaskId",
                      value === "none" ? undefined : parseInt(value)
                    )
                  }
                >
                  <SelectTrigger data-testid="parent-task-select">
                    <SelectValue placeholder="Select parent task (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="text-gray-500">
                        None (Top-level task)
                      </span>
                    </SelectItem>
                    {availableParentTasks.map((parentTaskOption) => (
                      <SelectItem
                        key={parentTaskOption.id}
                        value={parentTaskOption.id.toString()}
                      >
                        <span className="flex items-center">
                          <span className="truncate">
                            {parentTaskOption.title}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {parentTask && (
                  <p className="text-sm text-blue-600">
                    Creating sub-task under: {parentTask.title}
                  </p>
                )}
              </div>
            )}

            {/* Task Status (only show when editing) */}
            {isEditing && (
              <div className="space-y-2">
                <label htmlFor="task-status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={watchedStatus}
                  onValueChange={(value) =>
                    setValue("status", value as TaskFormData["status"])
                  }
                >
                  <SelectTrigger data-testid="task-status-select">
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
            )}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              data-testid="clear-button"
              onClick={() => reset()}
            >
              Clear
            </Button>
            <Button
              type="submit"
              data-testid={isEditing ? "update-task-button" : "add-task-button"}
            >
              {isEditing ? "Update Task" : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
