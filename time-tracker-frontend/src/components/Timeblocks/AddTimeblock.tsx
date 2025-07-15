import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { XIcon } from "lucide-react";
import { Input } from "../ui/input";

const timeblockSchema = z.object({
  description: z.string().min(1),
  start: z.date(),
  end: z.date(),
});

export default function AddTimeblock() {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };
  const form = useForm<z.infer<typeof timeblockSchema>>({
    resolver: zodResolver(timeblockSchema),
    defaultValues: {
      description: "",
      start: new Date(),
      end: new Date(),
    },
  });

  const onSubmit = (data: z.infer<typeof timeblockSchema>) => {
    console.log(data);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button data-testid="add-timeblock-button">Add Timeblock</Button>
      </DialogTrigger>
      <DialogContent data-testid="add-timeblock-dialog">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Timeblock</DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                data-testid="add-timeblock-dialog-close-button"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <label htmlFor="description">Description</label>
            <Input
              type="text"
              placeholder="Description"
              id="description"
              data-testid="timeblock-dialog-description-input"
              {...form.register("description")}
            />
            <label htmlFor="start">Start</label>
            <Input
              type="datetime-local"
              placeholder="Start"
              id="start"
              data-testid="timeblock-dialog-start-input"
              {...form.register("start")}
            />
            <label htmlFor="end">End</label>
            <Input
              type="datetime-local"
              placeholder="End"
              id="end"
              data-testid="timeblock-dialog-end-input"
              {...form.register("end")}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
