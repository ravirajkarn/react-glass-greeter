import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import Void from "../page/Void.tsx";
import RootLayout from "../page/RootLayout.tsx";
import IdleScreen from "../page/IdleScreen.tsx";
import Login from "../page/Login.tsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/void" element={<Void />} />
      <Route path="/" element={<RootLayout />}>
        <Route index element={<IdleScreen />} />
        <Route path="login" element={<Login />} />
      </Route>
    </>,
  ),
);
