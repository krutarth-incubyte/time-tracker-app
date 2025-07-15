import { createBrowserRouter } from "react-router-dom";
import Tasks from "./pages/Tasks";
import Timeblocks from "./pages/Timeblocks";

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
    path: "/timeblocks/:id",
    element: <Timeblocks />,
  },
];

export const router = createBrowserRouter(routes);
