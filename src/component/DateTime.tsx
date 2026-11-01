import React from "react";
import { useClock } from "../context/ClockContext";

export interface DateTimeProps {
  variant?: "full" | "short";
  placement?: "lockScreen" | "login";
  className?: string;
}

const FORMATTERS = {
  time: new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }),
  weekShort: new Intl.DateTimeFormat(undefined, { weekday: "short" }),
  monthShort: new Intl.DateTimeFormat(undefined, { month: "short" }),
  weekLong: new Intl.DateTimeFormat(undefined, { weekday: "long" }),
  monthLong: new Intl.DateTimeFormat(undefined, { month: "long" }),
};

const DateTime = React.memo(function DateTime({
  variant = "full",
  className = "",
  placement = "login",
}: DateTimeProps) {
  const clock = useClock();

  const renderContent = () => {
    const day = clock.getDate().toString().padStart(2, "0");

    if (variant === "short" && placement === "login") {
      return (
        <span className="uppercase tracking-wider">
          {FORMATTERS.weekShort.format(clock)} {day} {FORMATTERS.monthShort.format(clock)}
        </span>
      );
    }

    if (variant === "full" && placement === "login") {
      return (
        <div className="flex flex-col gap-1 ">
          <div className="uppercase tracking-[0.15em] pl-2 font-bold text-white/60 dark:text-black/60">
            {FORMATTERS.weekLong.format(clock)} &middot; {FORMATTERS.monthLong.format(clock)} {day}
          </div>
          <div className="text-4xl font-light tracking-tight leading-none text-[5rem] uppercase">
            {FORMATTERS.time.format(clock)}
          </div>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <div className="text-xs md:text-sm tracking-[0.25em] font-medium text-white/80 mb-2 uppercase">
          {FORMATTERS.weekLong.format(clock)} &middot; {FORMATTERS.monthLong.format(clock)} {day}
        </div>
        <div className="text-8xl md:text-[150px] font-light leading-none tracking-tight mb-2">
          {FORMATTERS.time.format(clock)}
        </div>
      </div>
    );
  };

  return (
    <time dateTime={clock.toISOString()} className={`block select-none ${className}`}>
      {renderContent()}
    </time>
  );
});

export default DateTime;
