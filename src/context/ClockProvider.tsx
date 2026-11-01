import { useEffect, useState, type ReactNode } from "react";
import { ClockContext } from "./ClockContext";

interface ClockProviderProps {
  children?: ReactNode;
}

export function ClockProvider({ children }: ClockProviderProps) {
  const [clock, setClock] = useState<Date>(() => new Date());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    const syncToMinute = () => {
      setClock(new Date());

      const now = new Date();
      const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

      timeoutId = setTimeout(
        () => {
          setClock(new Date());
          intervalId = setInterval(() => {
            setClock(new Date());
          }, 60_000);
        },
        Math.max(0, msUntilNextMinute),
      );
    };

    syncToMinute();

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  return <ClockContext.Provider value={clock}>{children}</ClockContext.Provider>;
}
