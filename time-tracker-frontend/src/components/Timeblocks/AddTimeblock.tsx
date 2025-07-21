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
import { DatePicker } from "../ui/date-picker";
import { TimePicker } from "../ui/time-picker";
import { AddTimeblockSchema } from "@/types/timeblocks";

// Updated schema to include separate date and time fields for validation
const timeblockFormSchema = z
  .object({
    description: z
      .string()
      .min(1, { message: "Timeblock description is required" }),
    date: z.date({ message: "Date is required" }),
    startTime: z.string().min(1, { message: "Start time is required" }),
    endTime: z.string().min(1, { message: "End time is required" }),
    taskId: z.number({ message: "Timeblock taskId is required" }),
  })
  .refine(
    (data) => {
      // Validate that end time is after start time
      if (data.startTime && data.endTime) {
        const [startHour] = data.startTime.split(":").map(Number);
        const [endHour] = data.endTime.split(":").map(Number);
        return endHour > startHour;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

type TimeblockFormData = z.infer<typeof timeblockFormSchema>;

export default function AddTimeblock({
  taskId,
  addTimeblockHandler,
}: {
  taskId: number;
  addTimeblockHandler: (timeblock: AddTimeblockSchema) => void;
}) {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TimeblockFormData>({
    resolver: zodResolver(timeblockFormSchema),
    defaultValues: {
      description: "",
      date: new Date(),
      startTime: "",
      endTime: "",
      taskId: taskId,
    },
  });

  // Watch form values for controlled components
  const watchedDate = watch("date");
  const watchedStartTime = watch("startTime");
  const watchedEndTime = watch("endTime");

  // Helper function to combine date and time into a Date object
  const combineDateTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(":").map(Number);
    const combinedDate = new Date(date);
    combinedDate.setHours(hours, minutes || 0, 0, 0);
    return combinedDate;
  };

  const handleAddTimeblock = (data: TimeblockFormData) => {
    // Convert form data to AddTimeblockSchema format
    const timeblockData: AddTimeblockSchema = {
      description: data.description,
      start: combineDateTime(data.date, data.startTime),
      end: combineDateTime(data.date, data.endTime),
      taskId: data.taskId,
    };

    addTimeblockHandler(timeblockData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button data-testid="add-timeblock-button">Add Timeblock</Button>
      </DialogTrigger>
      <DialogContent data-testid="add-timeblock-dialog">
        <form onSubmit={handleSubmit(handleAddTimeblock)}>
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
          <div className="flex flex-col gap-4">
            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <Input
                type="text"
                placeholder="Description"
                id="description"
                data-testid="timeblock-dialog-description-input"
                {...register("description")}
              />
              {errors.description && (
                <p
                  className="text-red-500 text-sm mt-1"
                  data-testid="timeblock-dialog-description-error"
                >
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Date Field */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                Date
              </label>
              <DatePicker
                value={watchedDate}
                {...register("date")}
                onChange={(date: Date | undefined) =>
                  setValue("date", date ?? new Date())
                }
                placeholder="Select date"
                data-testid="timeblock-dialog-date-input"
              />
              {errors.date && (
                <p
                  className="text-red-500 text-sm mt-1"
                  data-testid="timeblock-dialog-date-error"
                >
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Start Time Field */}
            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium mb-1"
              >
                Start Time
              </label>
              <TimePicker
                value={watchedStartTime}
                {...register("startTime")}
                onChange={(time) => setValue("startTime", time)}
                placeholder="Select start time"
                data-testid="timeblock-dialog-start-time-input"
              />
              {errors.startTime && (
                <p
                  className="text-red-500 text-sm mt-1"
                  data-testid="timeblock-dialog-start-time-error"
                >
                  {errors.startTime.message}
                </p>
              )}
            </div>

            {/* End Time Field */}
            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-medium mb-1"
              >
                End Time
              </label>
              <TimePicker
                value={watchedEndTime}
                {...register("endTime")}
                onChange={(time) => setValue("endTime", time)}
                placeholder="Select end time"
                data-testid="timeblock-dialog-end-time-input"
              />
              {errors.endTime && (
                <p
                  className="text-red-500 text-sm mt-1"
                  data-testid="timeblock-dialog-end-time-error"
                >
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-start mt-4">
            <Button
              type="submit"
              data-testid="add-timeblock-dialog-submit-button"
            >
              Add Timeblock
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
