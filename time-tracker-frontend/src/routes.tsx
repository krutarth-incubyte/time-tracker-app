import { createBrowserRouter } from "react-router-dom";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";

export const routes = [
  {
    path: "/",
    element: <Tasks />,
  },
  {
    path: "/tasks",
    element: <Tasks />,
  },
  {
    path: "/tasks/:taskId",
    element: <TaskDetail />,
  },
];

export const router = createBrowserRouter(routes);
