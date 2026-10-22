import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <>
      <div>Root Layout</div>
      <Outlet />
    </>
  );
}
