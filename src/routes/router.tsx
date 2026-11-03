import { createMemoryRouter, createRoutesFromElements, Route } from "react-router";
import RootLayout from "../page/RootLayout.tsx";
import React from "react";

const LockScreen = React.lazy(() => import("../page/LockScreen.tsx"));
const Login = React.lazy(() => import("../page/Login.tsx"));

export const router = createMemoryRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<LockScreen />} />
        <Route path="login" element={<Login />} />
      </Route>
    </>,
  ),
);
