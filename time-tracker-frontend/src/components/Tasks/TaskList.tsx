export default function TaskList({ tasks }: { tasks?: Record<string, any>[] }) {
  return (
    <div>
      <h1>Task List</h1>
      {tasks?.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
}
