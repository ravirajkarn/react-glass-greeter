import { type UserProfile, FALLBACK_USERS } from "../utils/Profile";
import { type BatteryData, FALLBACK_BATTERY } from "../utils/Battery";

// ============================================================================
// 1. INTERFACE SEGREGATION PRINCIPLE (ISP)
// Consumers only depend on the exact domain contract they actually use.
// ============================================================================

export interface GreeterAuth {
  readonly inAuthentication: boolean;
  readonly isAuthenticated: boolean;
  getUsers(): UserProfile[];
  authenticate(username: string): void;
  respond(password: string): void;
  cancel(): void;
  startSession(session?: string | null): void;
  onShowPrompt(callback: (text: string, type: number) => void): () => void;
  onAuthComplete(callback: () => void): () => void;
}

export interface GreeterPower {
  canHibernate(): boolean;
  canRestart(): boolean;
  canShutdown(): boolean;
  hibernate(): void;
  restart(): void;
  shutdown(): void;
}

export interface GreeterBattery {
  canAccessBattery(): boolean;
  batteryData(): BatteryData;
  onBatteryUpdate(callback: () => void): () => void;
}

// Unified contract composed of segregated interfaces
export interface WebGreeter extends GreeterAuth, GreeterPower, GreeterBattery {
  readonly isAvailable: boolean;
}

// ============================================================================
// 2. SINGLE RESPONSIBILITY & DEPENDENCY INVERSION (SRP & DIP)
// Production adapter strictly handles real LightDM API interactions.
// ============================================================================

class LightDMGreeterService implements WebGreeter {
  readonly isAvailable = true;
  private readonly ldm: any;

  constructor(ldmInstance: any) {
    this.ldm = ldmInstance;
  }

  getUsers(): UserProfile[] {
    const users = this.ldm.users;
    return Array.isArray(users) && users.length > 0 ? users : FALLBACK_USERS;
  }

  authenticate(username: string): void {
    if (this.ldm.in_authentication) {
      this.ldm.cancel_authentication();
    }
    this.ldm.authenticate(username);
  }

  respond(password: string): void {
    this.ldm.respond(password);
  }

  cancel(): void {
    this.ldm.cancel_authentication?.();
  }

  startSession(session?: string | null): void {
    const targetSession =
      session || this.ldm.default_session || this.ldm.sessions?.[0]?.key || null;
    this.ldm.start_session(targetSession);
  }

  canHibernate(): boolean {
    return Boolean(this.ldm.can_hibernate);
  }

  canRestart(): boolean {
    return Boolean(this.ldm.can_restart);
  }

  canShutdown(): boolean {
    return Boolean(this.ldm.can_shutdown);
  }

  hibernate(): void {
    if (this.canHibernate()) this.ldm.hibernate();
  }

  restart(): void {
    if (this.canRestart()) this.ldm.restart();
  }

  shutdown(): void {
    if (this.canShutdown()) this.ldm.shutdown();
  }

  canAccessBattery(): boolean {
    return Boolean(this.ldm.can_access_battery);
  }

  batteryData(): BatteryData {
    if (this.canAccessBattery() && this.ldm.battery_data) {
      return this.ldm.battery_data;
    }
    return FALLBACK_BATTERY;
  }

  onBatteryUpdate(callback: () => void): () => void {
    const signal = this.ldm.battery_update;
    if (!signal?.connect) return () => {};

    signal.connect(callback);
    return () => signal.disconnect?.(callback);
  }
  get inAuthentication(): boolean {
    return Boolean(this.ldm.in_authentication);
  }

  get isAuthenticated(): boolean {
    return Boolean(this.ldm.is_authenticated);
  }

  onShowPrompt(callback: (text: string, type: number) => void): () => void {
    const signal = this.ldm.show_prompt;
    if (!signal?.connect) return () => {};
    signal.connect(callback);
    return () => signal.disconnect?.(callback);
  }

  onAuthComplete(callback: () => void): () => void {
    const signal = this.ldm.authentication_complete;
    if (!signal?.connect) return () => {};
    signal.connect(callback);
    return () => signal.disconnect?.(callback);
  }
}

// ============================================================================
// 3. OPEN/CLOSED & LISKOV SUBSTITUTION PRINCIPLE (OCP & LSP)
// Dev mock adapter implements the exact same contract without polluting
// production code with "if (!this.ldm)" branches.
// ============================================================================

class MockGreeterService implements WebGreeter {
  readonly isAvailable = false;

  private _inAuth = false;
  private _isAuth = false;
  private authCompleteListeners = new Set<() => void>();

  get inAuthentication(): boolean {
    return this._inAuth;
  }

  get isAuthenticated(): boolean {
    return this._isAuth;
  }

  authenticate(username: string): void {
    this._inAuth = true;
    this._isAuth = false;
    console.info(`[Greeter:Mock] Authenticate started for: ${username}`);
  }

  respond(password: string): void {
    setTimeout(() => {
      this._inAuth = false;
      this._isAuth = password === "1234" || password === "admin";
      this.authCompleteListeners.forEach((cb) => cb());
    }, 400);
  }

  onShowPrompt(_callback: (text: string, type: number) => void): () => void {
    return () => {};
  }

  onAuthComplete(callback: () => void): () => void {
    this.authCompleteListeners.add(callback);
    return () => this.authCompleteListeners.delete(callback);
  }

  getUsers(): UserProfile[] {
    return FALLBACK_USERS;
  }

  cancel(): void {
    console.info("[Greeter:Mock] Cancel authentication");
  }

  startSession(session?: string | null): void {
    console.info(`[Greeter:Mock] Starting session: ${session ?? "default"}`);
  }

  canHibernate(): boolean {
    return true;
  }

  canRestart(): boolean {
    return true;
  }

  canShutdown(): boolean {
    return true;
  }

  hibernate(): void {
    console.info("[Greeter:Mock] Hibernate");
  }

  restart(): void {
    console.info("[Greeter:Mock] Restart");
  }

  shutdown(): void {
    console.info("[Greeter:Mock] Shutdown");
  }

  canAccessBattery(): boolean {
    return true;
  }

  batteryData(): BatteryData {
    return FALLBACK_BATTERY;
  }

  onBatteryUpdate(_callback: () => void): () => void {
    return () => {};
  }
}

// ============================================================================
// 4. FACTORY INSTANTIATION
// Resolves the environment once at startup.
// ============================================================================

function createGreeterService(): WebGreeter {
  const nativeLightDM = typeof window !== "undefined" ? (window as any).lightdm : undefined;

  if (nativeLightDM) {
    return new LightDMGreeterService(nativeLightDM);
  }
  return new MockGreeterService();
}

export const greeter: WebGreeter = createGreeterService();
