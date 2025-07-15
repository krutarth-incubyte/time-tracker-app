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

export default function AddTask() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Task</Button>
      </DialogTrigger>
      <DialogContent>
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
      </DialogContent>
    </Dialog>
  );
}
