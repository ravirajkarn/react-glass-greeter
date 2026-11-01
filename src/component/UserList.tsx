import React from "react";
import { CustomImage } from "./Image";
import { FaUserAlt } from "react-icons/fa";
import { motion, type Variants } from "motion/react";
import { useNavigate } from "react-router";
import { PiLockKeyThin } from "react-icons/pi";
import { useLightDMUsers, type UserProfile } from "./User";

export interface UserListProps {
  className?: string;
  onSelectUser?: (user: UserProfile, index: number) => void;
}

const revealVariants: Variants = {
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

const lockBadgeVariants: Variants = {
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

const UserList = React.memo(function UserList({ className = "", onSelectUser }: UserListProps) {
  const users = useLightDMUsers();
  const navigate = useNavigate();

  if (!users.length) return null;

  const handleSelect = (selectedUser: UserProfile, index: number) => {
    onSelectUser?.(selectedUser, index);
    void navigate(`/login?user=${index}`);
  };

  return (
    <div
      role="list"
      aria-label="Available users"
      className={`flex flex-row items-center gap-4 flex-wrap ${className}`}
    >
      {users.map((user, index) => {
        const statusLabel = user.logged_in ? "Logged in" : "Locked";
        const displayName = user.display_name || user.username || `User ${index + 1}`;

        return (
          <motion.button
            layout
            key={user.username ?? index}
            type="button"
            onClick={() => handleSelect(user, index)}
            aria-label={`Sign in as ${displayName}`}
            initial="rest"
            whileHover="hover"
            whileFocus="hover"
            animate="rest"
            className="group flex items-center text-left rounded-full p-2 -ml-2 focus-visible:ring-1 focus-visible:ring-white/40 outline-none select-none cursor-pointer"
          >
            {/* Avatar Container */}
            <div className="size-12 rounded-full border border-white/20 overflow-hidden shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-sm transition-transform duration-300 group-hover:scale-105">
              <CustomImage
                src={user.image}
                alt={`${displayName} avatar`}
                fallback={<FaUserAlt className="text-white/50 text-xl" aria-hidden="true" />}
              />
            </div>

            {/* User Metadata (Revealed on Hover/Focus) */}
            <motion.div
              variants={revealVariants}
              className="overflow-hidden flex flex-col justify-center whitespace-nowrap"
            >
              <div className="font-semibold text-[15px] text-white leading-tight mb-0.5">
                {displayName}
              </div>
              <div className="text-sm text-white/60 leading-tight">
                {statusLabel} <span aria-hidden="true">&middot;</span> click to sign in
              </div>
            </motion.div>

            {/* Lock Icon Circle (Revealed on Hover/Focus) */}
            <motion.div
              variants={lockBadgeVariants}
              className="h-12 rounded-full border border-white/20 overflow-hidden shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
            >
              <PiLockKeyThin className="text-[17px] text-white shrink-0" aria-hidden="true" />
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
});

export default UserList;
