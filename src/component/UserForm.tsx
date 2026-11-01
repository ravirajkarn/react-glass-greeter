import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaLongArrowAltRight, FaUserAlt } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { motion } from "motion/react";
import { useSearchParams } from "react-router";
import { CustomImage } from "./Image";
import { useLightDMUsers, type UserProfile } from "./User";

export interface UserFormProps {
  className?: string;
}

const UserForm = React.memo(function UserForm({ className = "" }: UserFormProps) {
  const users = useLightDMUsers();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState("");
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const pendingPasswordRef = useRef<string | null>(null);

  // O(1) user lookup with safe bounds fallback
  const rawIndex = Number(searchParams.get("user") ?? 0);
  const user: UserProfile | undefined = users[rawIndex] ?? users[0];

  const ldm = typeof window !== "undefined" ? (window as any).lightdm : undefined;

  // 1. Start PAM authentication session for the selected user
  const startAuthSession = useCallback(
    (username?: string) => {
      if (!ldm || !username) return;
      try {
        if (ldm.in_authentication) {
          ldm.cancel_authentication();
        }
        ldm.authenticate(username);
      } catch (err) {
        console.error("[LightDM] Failed to initialize authentication:", err);
      }
    },
    [ldm],
  );

  // 2. Wire up LightDM signals (show_prompt & authentication_complete)
  useEffect(() => {
    if (!user?.username) return;

    startAuthSession(user.username);

    if (!ldm) return;

    const handleShowPrompt = (_text: string, type: number) => {
      // type 1 === secret/password prompt
      if (type === 1 && pendingPasswordRef.current !== null) {
        const pass = pendingPasswordRef.current;
        pendingPasswordRef.current = null;
        ldm.respond(pass);
      }
    };

    const handleAuthComplete = () => {
      setIsAuthenticating(false);

      if (ldm.is_authenticated) {
        const targetSession = user.session || ldm.default_session || ldm.sessions?.[0]?.key || null;
        ldm.start_session(targetSession);
      } else {
        setErrorMessage("Invalid password. Please try again.");
        setPassword("");
        // Immediately restart PAM session for the next attempt
        startAuthSession(user.username);
        inputRef.current?.focus();
      }
    };

    ldm.show_prompt?.connect(handleShowPrompt);
    ldm.authentication_complete?.connect(handleAuthComplete);

    return () => {
      ldm.show_prompt?.disconnect(handleShowPrompt);
      ldm.authentication_complete?.disconnect(handleAuthComplete);
    };
  }, [ldm, user?.username, user?.session, startAuthSession]);

  // 3. CapsLock detection across key events and focus
  const checkCapsLock = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
      if ("getModifierState" in event) {
        setIsCapsLock(event.getModifierState("CapsLock"));
      }
    },
    [],
  );

  // 4. Form Submission Handler
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !password || isAuthenticating) return;

    setErrorMessage(null);
    setIsAuthenticating(true);

    // Local Vite Browser Dev Mode Mock
    if (!ldm) {
      setTimeout(() => {
        setIsAuthenticating(false);
        if (password === "admin" || password === "1234") {
          window.alert(`[Dev Mode] Logged in as ${user.username}`);
        } else {
          setErrorMessage("Invalid password (try '1234' in dev mode)");
          setPassword("");
          inputRef.current?.focus();
        }
      }, 500);
      return;
    }

    // Production LightDM Execution
    if (ldm.in_authentication) {
      ldm.respond(password);
    } else {
      pendingPasswordRef.current = password;
      startAuthSession(user.username);
    }
  };

  if (!user) return null;

  const displayName = user.display_name || user.username || "Unknown User";

  return (
    <form
      onSubmit={handleLogin}
      aria-label={`Login form for ${displayName}`}
      className={`w-105 select-none ${className}`}
    >
      {/* User Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="size-16 rounded-full border border-white/30 flex items-center justify-center bg-white/5 backdrop-blur-sm overflow-hidden shrink-0 shadow-md">
          <CustomImage
            src={user.image}
            alt={`${displayName} avatar`}
            className="h-full w-full object-cover"
            fallback={<FaUserAlt className="text-white/50 text-2xl" aria-hidden="true" />}
          />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-semibold tracking-wide text-white truncate">
            {displayName}
          </div>
          <div className="text-white/50 text-lg mt-0.5 truncate">{user.username || "guest"}</div>
        </div>
      </div>

      {/* Password Input with Shake Animation on Error */}
      <motion.div
        animate={errorMessage ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
        className="relative group w-full"
      >
        <input
          ref={inputRef}
          type="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          onKeyDown={checkCapsLock}
          onKeyUp={checkCapsLock}
          onClick={checkCapsLock}
          placeholder="Enter your password"
          disabled={isAuthenticating}
          required
          autoFocus
          autoComplete="current-password"
          aria-invalid={!!errorMessage}
          className={`flex h-12 w-full items-center bg-[#15161e]/80 backdrop-blur-md border-2 rounded-full pl-5 pr-12 transition-all text-white placeholder:text-white/40 outline-none disabled:opacity-50 ${
            errorMessage
              ? "border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
              : "border-[#007bff] shadow-[0_0_20px_rgba(139,164,220,0.15)] focus:shadow-[0_0_20px_rgba(0,123,255,0.4)]"
          }`}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAuthenticating || !password}
          aria-label="Log in"
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#007bff]/80 hover:bg-[#007bff] disabled:opacity-40 disabled:pointer-events-none text-white rounded-full size-10 flex items-center justify-center transition-all active:scale-95 shadow-sm shrink-0 cursor-pointer"
        >
          {isAuthenticating ? (
            <CgSpinner className="text-xl animate-spin" aria-hidden="true" />
          ) : (
            <FaLongArrowAltRight className="text-xl" aria-hidden="true" />
          )}
        </button>
      </motion.div>

      {/* Helper & Error Status Bar */}
      <div className="flex justify-between items-center mt-4 px-2 text-sm h-5">
        {errorMessage ? (
          <p role="alert" className="text-red-400 font-medium">
            {errorMessage}
          </p>
        ) : (
          <p className="text-white/60">
            Enter Password <span aria-hidden="true">&middot;</span> Caps Lock{" "}
            <span className={isCapsLock ? "text-amber-400 font-bold" : "text-white/40"}>
              {isCapsLock ? "ON" : "off"}
            </span>
          </p>
        )}
      </div>
    </form>
  );
});

export default UserForm;
