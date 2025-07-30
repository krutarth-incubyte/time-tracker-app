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
import { XIcon, Edit } from "lucide-react";
import { Input } from "../ui/input";
import { DatePicker } from "../ui/date-picker";
import { TimePicker } from "../ui/time-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timeblock } from "@/types/timeblocks";
import { useUpdateTimeblock } from "@/hooks/useTimeblocks";

const editTimeblockSchema = z
  .object({
    description: z
      .string()
      .min(1, { message: "Timeblock description is required" }),
    date: z.date({ message: "Date is required" }),
    startTime: z.string().min(1, { message: "Start time is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
  })
  .refine(
    (data) => {
      // Validate that end time is after start time
      if (data.startTime && data.endTime) {
        const [startHour, startMin] = data.startTime.split(":").map(Number);
        const [endHour, endMin] = data.endTime.split(":").map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        return endMinutes > startMinutes;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

type EditTimeblockFormData = z.infer<typeof editTimeblockSchema>;

interface EditTimeblockProps {
  timeblock: Timeblock;
  children?: React.ReactNode;
}

export default function EditTimeblock({
  timeblock,
  children,
}: EditTimeblockProps) {
  const [open, setOpen] = useState(false);
  const updateTimeblockMutation = useUpdateTimeblock();

  // Helper function to extract time from Date object
  const extractTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Helper function to extract date from Date object
  const extractDate = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditTimeblockFormData>({
    resolver: zodResolver(editTimeblockSchema),
    defaultValues: {
      description: timeblock.description,
      date: extractDate(new Date(timeblock.start)),
      startTime: extractTime(new Date(timeblock.start)),
      endTime: extractTime(new Date(timeblock.end)),
    },
  });

  // Watch form values for controlled components
  const watchedDate = watch("date");
  const watchedStartTime = watch("startTime");
  const watchedEndTime = watch("endTime");

  // Reset form when timeblock changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({
        description: timeblock.description,
        date: extractDate(new Date(timeblock.start)),
        startTime: extractTime(new Date(timeblock.start)),
        endTime: extractTime(new Date(timeblock.end)),
      });
    }
  }, [timeblock, open, reset]);

  // Helper function to combine date and time into a Date object
  const combineDateTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(":").map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes || 0, 0, 0);
    return combinedDate;
  };

  const handleUpdateTimeblock = (data: EditTimeblockFormData) => {
    const updatedTimeblock = {
      id: timeblock.id,
      data: {
        description: data.description,
        start: combineDateTime(data.date, data.startTime),
        end: combineDateTime(data.date, data.endTime),
        taskId: timeblock.taskId,
      },
    };

    updateTimeblockMutation.mutate(updatedTimeblock);
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
      <Edit className="w-4 h-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
      <DialogContent data-testid="edit-timeblock-dialog">
        <form onSubmit={handleSubmit(handleUpdateTimeblock)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Time Block
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                data-testid="edit-timeblock-dialog-close-button"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <Input
                type="text"
                placeholder="Description"
                id="description"
                data-testid="edit-timeblock-dialog-description-input"
                {...register("description")}
              />
              {errors.description && (
                <p
                  className="text-red-500 text-sm"
                  data-testid="edit-timeblock-dialog-description-error"
                >
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date *
              </label>
              <DatePicker
                value={watchedDate}
                onChange={(date: Date | undefined) =>
                  setValue("date", date ?? new Date())
                }
                placeholder="Select date"
                data-testid="edit-timeblock-dialog-date-input"
              />
              {errors.date && (
                <p
                  className="text-red-500 text-sm"
                  data-testid="edit-timeblock-dialog-date-error"
                >
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Start Time Field */}
            <div className="space-y-2">
              <label htmlFor="startTime" className="text-sm font-medium">
                Start Time *
              </label>
              <TimePicker
                value={watchedStartTime}
                onChange={(time) => setValue("startTime", time)}
                placeholder="Select start time"
                data-testid="edit-timeblock-dialog-start-time-input"
              />
              {errors.startTime && (
                <p
                  className="text-red-500 text-sm"
                  data-testid="edit-timeblock-dialog-start-time-error"
                >
                  {errors.startTime.message}
                </p>
              )}
            </div>

            {/* End Time Field */}
            <div className="space-y-2">
              <label htmlFor="endTime" className="text-sm font-medium">
                End Time *
              </label>
              <TimePicker
                value={watchedEndTime}
                onChange={(time) => setValue("endTime", time)}
                placeholder="Select end time"
                data-testid="edit-timeblock-dialog-end-time-input"
              />
              {errors.endTime && (
                <p
                  className="text-red-500 text-sm"
                  data-testid="edit-timeblock-dialog-end-time-error"
                >
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => reset()}>
              Reset
            </Button>
            <Button
              type="submit"
              data-testid="edit-timeblock-dialog-submit-button"
              disabled={updateTimeblockMutation.isPending}
            >
              {updateTimeblockMutation.isPending
                ? "Updating..."
                : "Update Time Block"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
