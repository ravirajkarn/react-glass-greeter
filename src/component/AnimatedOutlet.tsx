import { useLocation, useOutlet } from "react-router";
import { AnimatePresence, motion } from "motion/react";

function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col w-full h-full"
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
}

export default AnimatedOutlet;
