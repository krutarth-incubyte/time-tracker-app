import { mockTimeblocks } from "@/components/Tasks/mockTasks";
import AddTimeblock from "@/components/Timeblocks/AddTimeblock";
import TimeblockList from "@/components/Timeblocks/TimeblockList";
import { filterTimeblocks } from "@/lib/utils";
import { AddTimeblockSchema, Timeblock } from "@/types/timeblocks";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Timeblocks() {
  const [timeblocks, setTimeblocks] = useState<Timeblock[]>([]);
  const { taskId } = useParams();
  useEffect(() => {
    if (taskId) {
      setTimeblocks(filterTimeblocks(mockTimeblocks, Number(taskId)));
    }
  }, [taskId]);

  function addTimeblock(timeblock: AddTimeblockSchema) {
    setTimeblocks([
      ...timeblocks,
      {
        id: timeblocks.length + 1,
        taskId: timeblock.taskId,
        start: timeblock.start,
        end: timeblock.end,
        description: timeblock.description,
        createdAt: new Date(),
      },
    ]);
  }

  function deleteTimeblock(id: number) {
    setTimeblocks(timeblocks.filter((timeblock) => timeblock.id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-bold" data-testid="timeblocks-title">
        Timeblocks
      </div>
      <div className="flex justify-start">
        <AddTimeblock
          taskId={Number(taskId)}
          addTimeblockHandler={addTimeblock}
        />
      </div>
      <TimeblockList
        timeblocks={timeblocks}
        deleteTimeblock={deleteTimeblock}
      />
    </div>
  );
}
