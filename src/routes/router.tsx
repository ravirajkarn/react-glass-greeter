import { createMemoryRouter, createRoutesFromElements, Route } from "react-router";
import RootLayout from "../page/RootLayout.tsx";
import LockScreen from "../page/LockScreen.tsx";
import Login from "../page/Login.tsx";

export const router = createMemoryRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route path="lockScreen" element={<LockScreen />} />
        <Route index element={<Login />} />
      </Route>
    </>,
  ),
);
