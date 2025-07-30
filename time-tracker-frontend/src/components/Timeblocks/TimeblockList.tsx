import { Timeblock } from "@/types/timeblocks";
import TimeblockItem from "./TimeblockItem";
import { Clock } from "lucide-react";

interface TimeblockListProps {
  timeblocks: Timeblock[];
  onDeleteTimeblock?: (timeblock: Timeblock) => void;
}

export default function TimeblockList({
  timeblocks,
  onDeleteTimeblock,
}: TimeblockListProps) {
  return (
    <div className="flex flex-col gap-2" data-testid="timeblock-list">
      {timeblocks.length > 0 ? (
        timeblocks.map((timeblock) => (
          <div key={timeblock.id}>
            <TimeblockItem
              timeblock={timeblock}
              onDeleteTimeblock={onDeleteTimeblock}
            />
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No time blocks found
          </h3>
          <p className="text-gray-500">
            Start tracking time by adding your first time block
          </p>
        </div>
      )}
    </div>
  );
}
