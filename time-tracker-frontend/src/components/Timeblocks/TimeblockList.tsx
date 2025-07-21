import { Timeblock } from "@/types/timeblocks";
import { Button } from "../ui/button";

export default function TimeblockList({
  timeblocks,
  deleteTimeblock,
}: {
  timeblocks: Timeblock[];
  deleteTimeblock: (id: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2" data-testid="timeblock-list">
      {timeblocks.length > 0 ? (
        timeblocks.map((timeblock) => (
          <div key={timeblock.id}>
            {timeblock.description}
            <Button
              className="mx-3"
              data-testid="timeblock-delete-button"
              onClick={() => deleteTimeblock(timeblock.id)}
            >
              Delete
            </Button>
          </div>
        ))
      ) : (
        <div>No timeblocks found</div>
      )}
    </div>
  );
}
