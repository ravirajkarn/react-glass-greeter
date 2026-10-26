import { TbCalendarEvent } from "react-icons/tb";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  dotColor: string;
}

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Daily Standup",
    time: "10:30 AM - 11:00 AM",
    dotColor: "bg-blue-400",
  },
  {
    id: "2",
    title: "Lunch with Design Team",
    time: "12:30 PM - 1:30 PM",
    dotColor: "bg-orange-400",
  },
  {
    id: "3",
    title: "Project Alpha Release",
    time: "5:00 PM",
    dotColor: "bg-red-500",
  },
];

interface EventProps {
  className?: string;
}

export default function Event({ className = "" }: EventProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Widget Header */}
      <div className="flex items-center gap-2 text-white/60 text-sm font-semibold uppercase tracking-wider mb-5">
        <TbCalendarEvent className="text-lg" />
        <span>Today's Schedule</span>
      </div>

      {/* Events List */}
      <div className="flex flex-col gap-4 overflow-auto">
        {MOCK_EVENTS.length > 0 ? (
          MOCK_EVENTS.map((event) => (
            <div key={event.id} className="flex gap-4 group">
              {/* Timeline Indicator */}
              <div className="flex flex-col items-center mt-1.5">
                <div
                  className={`size-2.5 rounded-full ${event.dotColor} shadow-[0_0_8px_currentColor] opacity-80`}
                />
                {/* Vertical line connecting the dots (hidden on the last item via CSS if desired, but simple works best here) */}
                <div className="w-px h-full bg-white/10 mt-1" />
              </div>

              {/* Event Details */}
              <div className="flex flex-col pb-2">
                <span className="text-white font-medium text-lg leading-tight group-hover:text-[#007bff] transition-colors">
                  {event.title}
                </span>
                <span className="text-white/50 text-sm mt-0.5">{event.time}</span>
              </div>
            </div>
          ))
        ) : (
          /* Empty State Fallback */
          <div className="text-white/40 text-sm italic">No remaining events today.</div>
        )}
      </div>
    </div>
  );
}
