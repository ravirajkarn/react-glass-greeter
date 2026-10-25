import { Outlet } from "react-router";
// import DefaultBG from "../assets/frankbeckerde-mountains-6540497_1920.jpg";
import DefaultBG from "../assets/bing_wallpaper_2026-10-04.jpg";
import useDynamicTheme from "../component/theme";
import "./rootLayout.css";
import DateTime from "../component/DateTime";
import { ClockProvider } from "../context/ClockProvider";

export default function RootLayout() {
  useDynamicTheme(DefaultBG);
  return (
    <div className="text-white font-chivo antialiased h-screen w-screen flex selection:bg-accent-blue selection:text-black">
      {/* Main Container */}
      <div className="flex h-full w-full relative z-10">
        <ClockProvider>
          {/* Left Side: Login Area */}
          <div className="flex-1 flex flex-col relative px-16 py-12">
            <Outlet />
          </div>
          {/* Right Side: Info Panel */}
          <div className="w-105 bg-panel-bg backdrop-blur-2xl border-l border-white/5 flex flex-col p-8 relative shadow-2xl">
            <DateTime variant="short" />
          </div>
        </ClockProvider>
      </div>
    </div>
  );
}
