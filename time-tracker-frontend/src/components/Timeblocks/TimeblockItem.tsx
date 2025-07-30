import { Timeblock } from "@/types/timeblocks";
import { Button } from "../ui/button";
import { Trash2, Clock, Calendar } from "lucide-react";
import EditTimeblock from "./EditTimeblock";

interface TimeblockItemProps {
  timeblock: Timeblock;
  onDeleteTimeblock?: (timeblock: Timeblock) => void;
}

export default function TimeblockItem({
  timeblock,
  onDeleteTimeblock,
}: TimeblockItemProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const calculateDuration = () => {
    const start = new Date(timeblock.start);
    const end = new Date(timeblock.end);
    const duration = end.getTime() - start.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-gray-100 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Description */}
          <div className="mb-3">
            <h4 className="font-medium text-gray-900 mb-1">
              {timeblock.description || "No description"}
            </h4>
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(new Date(timeblock.start))}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {formatTime(new Date(timeblock.start))} -{" "}
                {formatTime(new Date(timeblock.end))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-600">
                {calculateDuration()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 ml-4">
          <EditTimeblock timeblock={timeblock} />
          {onDeleteTimeblock && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteTimeblock(timeblock)}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
              data-testid="timeblock-delete-button"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
