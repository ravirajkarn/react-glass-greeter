import { createContext, useContext } from "react";

export const ClockContext = createContext<Date>(new Date());

export function useClock() {
  return useContext(ClockContext);
}
