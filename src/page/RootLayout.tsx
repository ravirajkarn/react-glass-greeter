import { Outlet } from "react-router";
import DefaultBG from "./assets/frankbeckerde-mountains-6540497_1920.jpg";
import useDynamicTheme from "../component/theme";

export default function RootLayout() {
  const theme = useDynamicTheme(DefaultBG);
  return (
    <>
      <div>Root Layout</div>
      <div>{theme}</div>
      <Outlet />
    </>
  );
}
