import { type Variants } from "motion/react";

export const revealVariants: Variants = {
  rest: {
    width: 0,
    opacity: 0,
    marginLeft: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
  hover: {
    width: "auto",
    opacity: 1,
    marginLeft: 16,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

export const lockBadgeVariants: Variants = {
  rest: {
    scale: 0.8,
    opacity: 0,
    width: 0,
    marginLeft: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  hover: {
    scale: 1,
    opacity: 1,
    width: 48,
    marginLeft: 16,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1], delay: 0.05 },
  },
};
