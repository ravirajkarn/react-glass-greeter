import { motion } from "motion/react";
import { CustomImage } from "./Image";
import type { UserProfile } from "../utils/Profile";
import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { PiLockKeyThin } from "react-icons/pi";
import { revealVariants, lockBadgeVariants } from "../services/UserCardAni";

export interface UserCardProps {
  user: UserProfile;
  index: number;
  isSelected?: boolean;
  onSelect: (user: UserProfile, index: number) => void;
  onHover: (index: number) => void;
}

const UserCard = React.memo(function UserCard({
  user,
  index,
  isSelected,
  onSelect,
  onHover,
}: UserCardProps) {
  const statusLabel = user.logged_in ? "Logged in" : "Locked";
  const displayName = user.display_name || user.username || `User ${index + 1}`;

  return (
    <motion.button
      layout
      type="button"
      role="listitem"
      aria-selected={isSelected}
      aria-label={`Sign in as ${displayName}`}
      onClick={() => onSelect(user, index)}
      initial={false}
      // Active user stays in "hover" (expanded) state; others stay in "rest" until hovered
      animate={isSelected ? "hover" : "rest"}
      onHoverStart={() => onHover(index)}
      whileHover="hover"
      className="group flex items-center text-left rounded-full p-2 -ml-2 focus-visible:ring-1 focus-visible:ring-white/40 outline-none select-none cursor-pointer"
    >
      {/* Avatar Container */}
      <div
        className={`size-12 rounded-full border overflow-hidden shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-sm transition-all duration-300 group-hover:scale-105 ${
          isSelected ? "border-white/60 ring-2 ring-white/20" : "border-white/20"
        }`}
      >
        <CustomImage
          src={user.image}
          alt={`${displayName} avatar`}
          fallback={<FaUserAlt className="text-white/50 text-xl" aria-hidden="true" />}
        />
      </div>

      {/* User Metadata (Always visible for selected user, revealed on hover for others) */}
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

      {/* Lock Icon Circle */}
      <motion.div
        variants={lockBadgeVariants}
        className="h-12 rounded-full border border-white/20 overflow-hidden shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
      >
        <PiLockKeyThin className="text-[17px] text-white shrink-0" aria-hidden="true" />
      </motion.div>
    </motion.button>
  );
});

export default UserCard;
