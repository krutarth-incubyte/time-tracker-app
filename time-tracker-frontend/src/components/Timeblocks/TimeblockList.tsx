import { Timeblock } from "@/types/timeblocks";
import { Button } from "../ui/button";

export default function TimeblockList({
  timeblocks,
}: {
  timeblocks: Timeblock[];
}) {
  return (
    <div className="flex flex-col gap-2" data-testid="timeblock-list">
      <Button>Add Timeblock</Button>
      {timeblocks.length > 0 ? (
        timeblocks.map((timeblock) => (
          <div key={timeblock.id}>{timeblock.description}</div>
        ))
      ) : (
        <div>No timeblocks found</div>
      )}
    </div>
  );
}
