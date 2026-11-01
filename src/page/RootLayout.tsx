// import DefaultBG from "../assets/frankbeckerde-mountains-6540497_1920.jpg";
import DefaultBG from "../assets/bing_wallpaper_2026-10-04.jpg";
import useDynamicTheme from "../component/theme";
import "./rootLayout.css";
import DateTime from "../component/DateTime";
import { ClockProvider } from "../context/ClockProvider";
import Weather from "../component/Weather";
import Player from "../component/Music";
import Event from "../component/Events";
import Battery from "../component/Battery";
import Notification from "../component/Notification";
import AnimatedOutlet from "../component/AnimatedOutlet";
import { AnimatePresence, motion } from "motion/react";
import { useResizable } from "../hooks/useResizable";

export default function RootLayout() {
  const defaultWidth: number = 500;
  const { width, startResize } = useResizable({
    initialWidth: defaultWidth,
    minWidth: 500,
    maxWidth: 1000,
  });

  useDynamicTheme(DefaultBG);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{ backgroundImage: `url(${DefaultBG})` }}
        className="bg-cover bg-no-repeat bg-center bg-fixed, min-h-screen overflow-hidden"
      >
        <div className="text-white font-chivo antialiased h-screen w-screen flex selection:bg-accent-blue selection:text-black">
          {/* Main Container */}
          <div className="flex h-full w-full relative z-10">
            <ClockProvider>
              {/* Left Side: Login Area */}
              <div className="flex-1 flex flex-col relative px-16 py-12 overflow-hidden h-full w-full">
                <AnimatedOutlet />
              </div>

              {/* Right Side: Info Panel */}
              <div
                style={{ width: `${width}px` }}
                className="[backdrop-filter:url(#glass-distortion)_blur(10px)] border-l border-white/20 flex flex-col p-8 relative shadow-2xl transition-none overflow-auto scrollbar-thin"
              >
                <div
                  onMouseDown={startResize}
                  className="w-2 absolute -left-1 cursor-ew-resize h-full top-0 hover:bg-white/10 transition-colors z-10 bg-transparent"
                />
                <div className="flex justify-end items-center gap-4 text-xs font-medium text-white/80 mb-12">
                  <DateTime variant="short" />
                  <Battery className="" />
                </div>

                <Weather className="" display="login" />
                <hr className="border-white/10 mb-8"></hr>

                <Event className="mb-1" />
                <hr className="border-white/10 mb-8"></hr>

                <Notification className="mb-2" />
                <hr className="border-white/10 mb-8"></hr>

                <Player />
              </div>
            </ClockProvider>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
