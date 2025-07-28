import AddTimeblock from "@/components/Timeblocks/AddTimeblock";
import TimeblockList from "@/components/Timeblocks/TimeblockList";
import { AddTimeblockSchema } from "@/types/timeblocks";
import { useParams } from "react-router-dom";
import {
  useTimeblocksForTask,
  useCreateTimeblock,
  useDeleteTimeblock,
} from "@/hooks/useTimeblocks";
import { TaskDetailHeader } from "@/components/TaskDetail/TaskDetailHeader";

export default function TaskDetail() {
  const { taskId } = useParams();
  const taskIdNum = Number(taskId);

  const {
    data: timeblocks = [],
    isLoading,
    error,
  } = useTimeblocksForTask(taskIdNum);
  const createTimeblockMutation = useCreateTimeblock();
  const deleteTimeblockMutation = useDeleteTimeblock();

  function addTimeblock(timeblock: AddTimeblockSchema) {
    createTimeblockMutation.mutate(timeblock);
  }

  function deleteTimeblock(id: number) {
    deleteTimeblockMutation.mutate(id);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold" data-testid="timeblocks-title">
          Timeblocks
        </div>
        <div>Loading timeblocks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-bold" data-testid="timeblocks-title">
          Timeblocks
        </div>
        <div className="text-red-500">
          Error loading timeblocks:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <TaskDetailHeader taskId={taskIdNum} />
      <div className="text-2xl font-bold" data-testid="timeblocks-title">
        Timeblocks for Task {taskId}
      </div>
      <div className="flex justify-start">
        <AddTimeblock taskId={taskIdNum} addTimeblockHandler={addTimeblock} />
      </div>
      {createTimeblockMutation.isPending && <div>Adding timeblock...</div>}
      {createTimeblockMutation.error && (
        <div className="text-red-500">
          Error adding timeblock:{" "}
          {createTimeblockMutation.error instanceof Error
            ? createTimeblockMutation.error.message
            : "Unknown error"}
        </div>
      )}
      {deleteTimeblockMutation.isPending && <div>Deleting timeblock...</div>}
      {deleteTimeblockMutation.error && (
        <div className="text-red-500">
          Error deleting timeblock:{" "}
          {deleteTimeblockMutation.error instanceof Error
            ? deleteTimeblockMutation.error.message
            : "Unknown error"}
        </div>
      )}
      <TimeblockList
        timeblocks={timeblocks}
        deleteTimeblock={deleteTimeblock}
      />
    </div>
  );
}
