import { useGetTask, useUpdateTask } from "@/hooks/useTasks";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

export function TaskDetailHeader({ taskId }: { taskId: number }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const { data: task, isLoading } = useGetTask(taskId);
  const updateTaskMutation = useUpdateTask();
  const [title, setTitle] = useState("");

  // Sync local state when task data loads
  useEffect(() => {
    if (task?.title) {
      setTitle(task.title);
    }
  }, [task?.title]);

  function handleTitleEdit() {
    setIsEditMode(false);
    updateTaskMutation.mutate({
      id: taskId,
      data: { title: title },
    });
  }

  function handleTitleCancel(): void {
    setIsEditMode(false);
    setTitle(task?.title || "");
  }

  // Show loading state while data is fetching
  if (isLoading) {
    return <div>Loading task...</div>;
  }

  // Show error if no task found
  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="flex gap-2">
      {isEditMode ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[150px] font-bold text-2xl"
          />
          <Button className="px-4 py-2 rounded-md" onClick={handleTitleEdit}>
            Save
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 rounded-md"
            onClick={handleTitleCancel}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold w-[150px]">{task?.title}</h1>
          {/* Use task data */}
          <Button
            onClick={() => {
              setTitle(task?.title || ""); // Set local state when entering edit mode
              setIsEditMode(true);
            }}
          >
            Edit
          </Button>
        </>
      )}
    </div>
  );
}
