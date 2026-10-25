import { useEffect, useState, type ReactNode } from "react";
import { ClockContext } from "./ClockContext";

interface ClockProviderProps {
  children?: ReactNode;
}

export function ClockProvider({ children }: ClockProviderProps) {
  const [clock, setClock] = useState<Date>(() => new Date());

  useEffect(() => {
    const updateClock = setInterval(() => {
      setClock(new Date());
    }, 1000);
    return () => clearInterval(updateClock);
  }, []);

  return <ClockContext.Provider value={clock}>{children}</ClockContext.Provider>;
}
