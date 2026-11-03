import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import type { UserProfile } from "../utils/Profile";
import UserCard from "./UserCard";
import { greeter, type GreeterAuth } from "../services/WebGreeter";

function useKeyboardUserSelection(
  users: UserProfile[],
  defaultIndex: number,
  onConfirm: (user: UserProfile, index: number) => void,
) {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const count = users.length;

  // Ensure selectedIndex stays within valid bounds if user list changes
  const safeIndex = count > 0 ? Math.min(selectedIndex, count - 1) : 0;

  useEffect(() => {
    if (count === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore keystrokes if the user is typing inside an input/textarea
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % count);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + count) % count);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const activeUser = users[safeIndex];
        if (activeUser) {
          onConfirm(activeUser, safeIndex);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [count, users, safeIndex, onConfirm]);

  return { selectedIndex: safeIndex, setSelectedIndex };
}

export interface UserListProps {
  className?: string;
  defaultUserIndex?: number;
  authService?: GreeterAuth;
  onSelectUser?: (user: UserProfile, index: number) => void;
}

const UserList = React.memo(function UserList({
  className = "",
  defaultUserIndex = 0,
  authService = greeter,
  onSelectUser,
}: UserListProps) {
  const navigate = useNavigate();
  const users = useMemo(() => authService.getUsers(), [authService]);

  const handleSelect = useCallback(
    (selectedUser: UserProfile, index: number) => {
      onSelectUser?.(selectedUser, index);
      void navigate(`/login?user=${index}`);
    },
    [navigate, onSelectUser],
  );

  const { selectedIndex, setSelectedIndex } = useKeyboardUserSelection(
    users,
    defaultUserIndex,
    handleSelect,
  );

  if (!users.length) return null;

  return (
    <div
      role="list"
      aria-label="Available users"
      className={`flex flex-row items-center gap-4 flex-wrap ${className}`}
    >
      {users.map((user, index) => (
        <UserCard
          key={user.username ?? index}
          user={user}
          index={index}
          isSelected={index === selectedIndex}
          onSelect={handleSelect}
          onHover={setSelectedIndex}
        />
      ))}
    </div>
  );
});

export default UserList;
