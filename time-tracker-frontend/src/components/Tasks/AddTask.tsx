import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTaskSchema } from "@/types/tasks";

const addTaskSchema = z.object({
  taskName: z.string().min(1, { message: "Task name is required" }),
  taskDescription: z.string(),
});

export default function AddTask({
  addTaskHandler,
}: {
  addTaskHandler: (task: AddTaskSchema) => void;
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddTaskSchema>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      taskName: "",
      taskDescription: "",
    },
  });

  function onSubmit(data: AddTaskSchema) {
    console.log(data);
    setOpen(false);
    addTaskHandler(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Task</Button>
      </DialogTrigger>
      <DialogContent data-testid="add-task-dialog">
        <form>
          <DialogHeader>
            <DialogTitle>Add A Task</DialogTitle>
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
          <div className="flex flex-col gap-2">
            <label htmlFor="task-name">Task Name</label>
            <Input
              type="text"
              placeholder="Task Name"
              id="task-name"
              data-testid="task-name-input"
              {...register("taskName")}
            />
            {errors.taskName && (
              <p className="text-red-500" data-testid="task-name-error">
                {errors.taskName.message}
              </p>
            )}
            <label htmlFor="task-description">Task Description</label>
            <Input
              type="text"
              placeholder="Task Description"
              id="task-description"
              data-testid="task-description-input"
              {...register("taskDescription")}
            />
          </div>
          <div className="flex justify-start gap-2">
            <Button
              variant="outline"
              type="button"
              data-testid="clear-button"
              onClick={() => {
                reset();
              }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              data-testid="add-task-button"
              onClick={handleSubmit(onSubmit)}
            >
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
