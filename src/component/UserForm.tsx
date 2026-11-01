import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { FaLongArrowAltRight, FaUserAlt } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { motion } from "motion/react";
import { useSearchParams } from "react-router";
import { CustomImage } from "./Image";
import { greeter, type GreeterAuth } from "../services/WebGreeter";
import type { UserProfile } from "../utils/Profile";

// ============================================================================
// 1. SRP: Dedicated Hook for Keyboard Modifier State
// ============================================================================
function useCapsLock() {
  const [isCapsLock, setIsCapsLock] = useState(false);

  const checkCapsLock = useCallback(
    (event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
      if ("getModifierState" in event) {
        setIsCapsLock(event.getModifierState("CapsLock"));
      }
    },
    [],
  );

  return { isCapsLock, checkCapsLock };
}

// ============================================================================
// 2. SRP & DIP: Dedicated Hook for PAM Authentication Lifecycle
// Depends strictly on the segregated GreeterAuth interface.
// ============================================================================

// 1. Add an optional 'onFailure' callback to usePamAuth
function usePamAuth(
  user: UserProfile | undefined,
  authService: GreeterAuth,
  onFailure?: () => void,
) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pendingPasswordRef = useRef<string | null>(null);
  const onFailureRef = useRef(onFailure);

  // Keep latest callback reference without re-triggering the PAM effect
  useEffect(() => {
    onFailureRef.current = onFailure;
  }, [onFailure]);

  const username = user?.username;
  const session = user?.session;

  useEffect(() => {
    if (!username) return;

    authService.authenticate(username);

    const unsubscribePrompt = authService.onShowPrompt((_text, type) => {
      if (type === 1 && pendingPasswordRef.current !== null) {
        const pass = pendingPasswordRef.current;
        pendingPasswordRef.current = null;
        authService.respond(pass);
      }
    });

    const unsubscribeComplete = authService.onAuthComplete(() => {
      setIsAuthenticating(false);

      if (authService.isAuthenticated) {
        authService.startSession(session);
      } else {
        setErrorMessage("Invalid password. Please try again.");
        onFailureRef.current?.(); // <-- Batches password reset & focus in the same tick!
        authService.authenticate(username);
      }
    });

    return () => {
      unsubscribePrompt();
      unsubscribeComplete();
    };
  }, [authService, username, session]);

  const submitPassword = useCallback(
    (password: string) => {
      if (!username || !password || isAuthenticating) return;

      setErrorMessage(null);
      setIsAuthenticating(true);

      if (authService.inAuthentication) {
        authService.respond(password);
      } else {
        pendingPasswordRef.current = password;
        authService.authenticate(username);
      }
    },
    [authService, username, isAuthenticating],
  );

  const clearError = useCallback(() => {
    setErrorMessage((prev) => (prev ? null : prev));
  }, []);

  return { isAuthenticating, errorMessage, submitPassword, clearError };
}

// ============================================================================
// 3. ISP & DIP: Presentational Form Component
// ============================================================================
export interface UserFormProps {
  className?: string;
  authService?: GreeterAuth;
}

const UserForm = React.memo(function UserForm({
  className = "",
  authService = greeter,
}: UserFormProps) {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const users = useMemo(() => authService.getUsers(), [authService]);
  const rawIndex = Number(searchParams.get("user") ?? 0);
  const user: UserProfile | undefined = users[rawIndex] ?? users[0];

  const { isCapsLock, checkCapsLock } = useCapsLock();

  // Handle reset and focus directly inside the failure event callback
  const handleAuthFailure = useCallback(() => {
    setPassword("");
    // Focus after the input re-enables from disabled={isAuthenticating}
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  const { isAuthenticating, errorMessage, submitPassword, clearError } = usePamAuth(
    user,
    authService,
    handleAuthFailure,
  );

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitPassword(password);
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
            clearError();
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
