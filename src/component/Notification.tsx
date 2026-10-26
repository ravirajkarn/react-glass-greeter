import { useState } from "react";
import { MdNotifications, MdCheckCircle, MdWarning, MdMessage } from "react-icons/md";

interface NotificationItem {
  id: string;
  type: "message" | "system" | "alert";
  title: string;
  content: string;
  time: string;
}

interface NotificationProps {
  className?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "message",
    title: "New Message from Alex",
    content: "Are we still on for the meeting at 2 PM?",
    time: "10m ago",
  },
  {
    id: "2",
    type: "alert",
    title: "Battery Low",
    content: "Your battery is at 15%. Please plug in soon.",
    time: "1h ago",
  },
  {
    id: "3",
    type: "system",
    title: "System Update Available",
    content: "A new version of kernel is ready to install.",
    time: "2h ago",
  },
];

export default function Notification({ className = "" }: NotificationProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "message":
        return <MdMessage className="text-blue-500 text-lg shrink-0 mt-0.5" />;
      case "alert":
        return <MdWarning className="text-amber-500 text-lg shrink-0 mt-0.5" />;
      case "system":
        return <MdCheckCircle className="text-emerald-500 text-lg shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className={`w-full font-chivo flex flex-col ${className}`}>
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-black/60 dark:text-white/60 text-sm font-semibold uppercase tracking-wider transition-colors">
          <MdNotifications className="text-lg" />
          <span>Notifications</span>
          {notifications.length > 0 && (
            <span className="bg-[#007bff] text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none ml-1 shadow-sm">
              {notifications.length}
            </span>
          )}
        </div>

        {/* Clear All Button */}
        {notifications.length > 0 && (
          <button
            onClick={() => setNotifications([])}
            className="text-xs text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors tracking-wide"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-3 overflow-auto scrollbar-thin">
        {notifications.length > 0 ? (
          notifications.map((note) => (
            <div
              key={note.id}
              className="group bg-black/5 hover:bg-black/10 border-black/5 hover:border-black/10 dark:bg-white/5 dark:hover:bg-white/10 border dark:border-white/5 dark:hover:border-white/10 rounded-xl p-3 flex gap-3 transition-all cursor-default shadow-sm dark:shadow-none"
            >
              {getIcon(note.type)}

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-black/80 dark:text-white text-sm font-semibold truncate transition-colors">
                    {note.title}
                  </span>
                  <span className="text-black/40 dark:text-white/40 text-[10px] shrink-0 font-medium transition-colors">
                    {note.time}
                  </span>
                </div>
                <span className="text-black/60 dark:text-white/60 text-xs mt-0.5 line-clamp-1 group-hover:text-black/80 dark:group-hover:text-white/80 transition-colors">
                  {note.content}
                </span>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="bg-black/5 border-black/10 dark:bg-white/5 border dark:border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 transition-colors">
            <MdNotifications className="text-black/20 dark:text-white/20 text-4xl mb-1 transition-colors" />
            <span className="text-black/60 dark:text-white/60 text-sm font-medium transition-colors">
              All caught up!
            </span>
            <span className="text-black/40 dark:text-white/40 text-xs transition-colors">
              No new notifications.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
