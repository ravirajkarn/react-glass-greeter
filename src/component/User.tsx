import type React from "react";
import { useState } from "react";
import { lightdm } from "nody-greeter-types";
import { FaLongArrowAltRight, FaUserAlt } from "react-icons/fa"; // Added fallback icon

export default function User() {
  const [isCapsLock, setIsCapsLock] = useState<boolean>(false);
  const [imgFailed, setImgFailed] = useState<boolean>(false);

  // Safely grab the first user (Fallback to a default if empty)
  const user = lightdm.users.at(0);

  const keyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLock(event.getModifierState("CapsLock"));
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) return;

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;

    if (!password) return;

    // Standard LightDM Authentication Flow
    // 1. Start authentication for the specific user
    lightdm.authenticate(user.username);

    // Note: In a full implementation, you should listen for the 'show-prompt'
    // event from lightdm before responding, but for simple setups this often works:
    setTimeout(() => {
      lightdm.respond(password);
    }, 100);
  };

  return (
    <form onSubmit={handleLogin} className="absolute top-1/2 -translate-y-1/2 w-105">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-8">
        {/* Avatar with Fallback */}
        <div className="h-16 w-16 rounded-full border border-white/30 flex items-center justify-center bg-white/5 backdrop-blur-sm overflow-hidden shrink-0">
          {user?.image && !imgFailed ? (
            <img
              src={user.image}
              alt={`${user.display_name} avatar`}
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <FaUserAlt className="text-white/50 text-2xl" />
          )}
        </div>
        <div>
          <div className="text-2xl font-semibold tracking-wide text-white">
            {user?.display_name || "Unknown User"}
          </div>
          <div className="text-white/50 text-lg mt-0.5">{user?.username || "guest"}</div>
        </div>
      </div>

      {/* Password Input */}
      <div className="relative group w-full">
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          onKeyDown={keyPress}
          onKeyUp={keyPress}
          required
          autoFocus
          className="flex h-12 w-full items-center bg-[#15161e]/80 backdrop-blur-md border-2 border-[#007bff] rounded-full pl-5 pr-12 shadow-[0_0_20px_rgba(139,164,220,0.15)] transition-all text-white outline-none focus:shadow-[0_0_20px_rgba(0,123,255,0.4)]"
        />

        {/* Submit button */}
        <button
          type="submit"
          aria-label="Log in"
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#007bff]/80 hover:bg-[#007bff] text-white rounded-full size-10 flex items-center justify-center transition-colors shadow-sm shrink-0"
        >
          <span className="text-xl leading-none font-bold flex items-center justify-center">
            <FaLongArrowAltRight />
          </span>
        </button>
      </div>

      {/* Helper Text */}
      <div className="flex justify-between items-center mt-4 px-2 text-sm h-5">
        <p className="text-white/60">
          Enter Password &middot; Caps Lock{" "}
          <span className={isCapsLock ? "text-red-400 font-bold" : ""}>
            {isCapsLock ? "ON" : "off"}
          </span>
        </p>
      </div>
    </form>
  );
}
