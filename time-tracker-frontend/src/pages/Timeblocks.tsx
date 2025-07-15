import { mockTimeblocks } from "@/components/Tasks/mockTasks";
import TimeblockList from "@/components/Timeblocks/TimeblockList";
import { Timeblock } from "@/types/timeblocks";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const filterTimeblocks = (timeblocks: Timeblock[], taskId: number) => {
  return timeblocks.filter((timeblock) => timeblock.taskId === taskId);
};

export default function Timeblocks() {
  const [timeblocks, setTimeblocks] = useState<Timeblock[]>([]);
  const { taskId } = useParams();
  useEffect(() => {
    if (taskId) {
      setTimeblocks(filterTimeblocks(mockTimeblocks, Number(taskId)));
    }
  }, [taskId]);
  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-bold" data-testid="timeblocks-title">
        Timeblocks
      </div>
      <TimeblockList timeblocks={timeblocks} />
    </div>
  );
}
