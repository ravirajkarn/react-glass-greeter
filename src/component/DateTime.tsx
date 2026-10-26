import { useMemo } from "react";
import { useClock } from "../context/ClockContext";

interface DateTimeProp {
  variant?: "full" | "short";
}

function DateTime({ variant = "full" }: DateTimeProp) {
  const clock = useClock();

  const format = useMemo(() => {
    return {
      time: new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      weekLong: new Intl.DateTimeFormat(undefined, { weekday: "long" }),
      monthsLong: new Intl.DateTimeFormat(undefined, { month: "long" }),
      monthsShort: new Intl.DateTimeFormat(undefined, { month: "short" }),
      weekShort: new Intl.DateTimeFormat(undefined, { weekday: "short" }),
    };
  }, []);

  const day = clock.getDate().toString().padStart(2, "0");

  if (variant == "short") {
    return (
      <span>
        {format.weekShort.format(clock)} {day} {format.monthsShort.format(clock)}
      </span>
    );
  }

  return (
    <div className="uppercase">
      <div>
        {day} &middot; {format.monthsLong.format(clock)} {format.weekLong.format(clock)}
      </div>
      <div>{format.time.format(clock)}</div>
    </div>
  );
}

export default DateTime;
