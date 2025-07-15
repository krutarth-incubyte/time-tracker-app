import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";

export default function AddTimeblock() {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button data-testid="add-timeblock-button">Add Timeblock</Button>
      </DialogTrigger>
      <DialogContent data-testid="add-timeblock-dialog">
        <div className="text-2xl font-bold">Add Timeblock</div>
        <DialogClose asChild>
          <Button data-testid="add-timeblock-dialog-close-button">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
