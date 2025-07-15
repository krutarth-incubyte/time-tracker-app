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

export default function AddTask() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Task</Button>
      </DialogTrigger>
      <DialogContent>
        <form>
          <DialogHeader>
            <DialogTitle>Add A Task</DialogTitle>
            <DialogClose asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2"
                data-testid="close-button"
              >
                <XIcon className="w-4 h-4" stroke="white" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <label htmlFor="task-name">Task Name</label>
            <Input type="text" placeholder="Task Name" id="task-name" />
            <label htmlFor="task-description">Task Description</label>
            <Input
              type="text"
              placeholder="Task Description"
              id="task-description"
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
