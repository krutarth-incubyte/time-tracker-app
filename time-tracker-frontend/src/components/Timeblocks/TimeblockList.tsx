import { Timeblock } from "@/types/timeblocks";

export default function TimeblockList({
  timeblocks = [],
}: {
  timeblocks: Timeblock[];
}) {
  return (
    <div>
      {timeblocks.map((timeblock) => (
        <div key={timeblock.id}>{timeblock.description}</div>
      ))}
    </div>
  );
}
