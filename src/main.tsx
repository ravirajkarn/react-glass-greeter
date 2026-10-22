import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes/router";
import "./main.css";

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
