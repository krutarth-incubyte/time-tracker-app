import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";

export default function AddTask() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Task</Button>
      </DialogTrigger>
    </Dialog>
  );
}
