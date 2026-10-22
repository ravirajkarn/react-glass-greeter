import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import Void from "./Void.tsx";
import RootLayout from "./RootLayout.tsx";
import IdleScreen from "./IdleScreen.tsx";
import Login from "./Login.tsx";

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
