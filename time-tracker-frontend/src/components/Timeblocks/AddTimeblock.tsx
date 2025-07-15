import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
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
      </DialogContent>
    </Dialog>
  );
}
