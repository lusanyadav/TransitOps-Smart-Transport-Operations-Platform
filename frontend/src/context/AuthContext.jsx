import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  MAX_LOGIN_ATTEMPTS,
  ROLE_PERMISSIONS,
  ROLE_LANDING,
} from "@/constants/permissions";
import { authService } from "@/services/authService";

const AuthContext = createContext(null);

const SESSION_KEY = "transitops.session";
const ATTEMPTS_KEY = "transitops.loginAttempts";

const readAttempts = () => {
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY)) || {};
  } catch {
    return {};
  }
};

const writeAttempts = (attempts) => {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
};

const readSession = () => {
  try {
    const raw =
      localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);

    if (!raw) return null;

    const session = JSON.parse(raw);

    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
};

/** "Meera Shah" -> "MS". Falls back to the first two letters of the email. */
const initialsFor = (fullName, email) => {
  const source = (fullName || "").trim();
  if (source) {
    const parts = source.split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  }
  return (email || "??").slice(0, 2).toUpperCase();
};

/** Normalizes a backend/mock { user, token } payload into the shape the app stores/reads. */
const TOKEN_EXPIRY_MS =
  Number(import.meta.env.VITE_TOKEN_EXPIRY_MS) || 1800000;

const toSession = ({ user, token }) => ({
  email: user.email,
  role: user.role,
  full_name: user.full_name,
  initials: initialsFor(user.full_name, user.email),
  token,
  expiresAt: Date.now() + TOKEN_EXPIRY_MS,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession());

  useEffect(() => {
    const timer = setInterval(() => {
      const session = readSession();

      if (!session && user) {
        logout();
        alert("Session expired. Please login again.");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [user]);

  useEffect(() => {
    // Keep tabs in sync if the user logs out elsewhere.
    const onStorage = (e) => {
      if (e.key === SESSION_KEY && !e.newValue) setUser(null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /**
   * Attempts a sign-in via authService (mock fixture today, real /user/signin later).
   * Tracks failed attempts per-email and locks the account after
   * MAX_LOGIN_ATTEMPTS, mirroring the mockup's error state.
   */
  const login = async ({ email, password, role, remember }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const attempts = readAttempts();
    const record = attempts[normalizedEmail] || { count: 0, locked: false };

    if (record.locked) {
      return {
        ok: false,
        locked: true,
        error:
          "Account locked after 5 failed attempts. Contact your administrator to reset access.",
      };
    }

    try {
      const { user: account, token } = await authService.signIn({
        email: normalizedEmail,
        password,
      });

      if (role && account.role !== role) {
        throw new Error(
          "That account is not registered under the selected role.",
        );
      }

      // Successful login resets the failed-attempt counter for this email.
      delete attempts[normalizedEmail];
      writeAttempts(attempts);

      const session = toSession({ user: account, token });
      const store = remember ? localStorage : sessionStorage;
      store.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      return { ok: true, landing: ROLE_LANDING[account.role] };
    } catch (err) {
      const nextCount = record.count + 1;
      const locked = nextCount >= MAX_LOGIN_ATTEMPTS;
      attempts[normalizedEmail] = { count: nextCount, locked };
      writeAttempts(attempts);

      if (locked) {
        return {
          ok: false,
          locked: true,
          error:
            "Account locked after 5 failed attempts. Contact your administrator to reset access.",
        };
      }

      const remaining = MAX_LOGIN_ATTEMPTS - nextCount;
      return {
        ok: false,
        locked: false,
        error: `${err.message} ${remaining} attempt${remaining === 1 ? "" : "s"} remaining before lockout.`,
      };
    }
  };

  /** Registers a new account via authService (mock sign-up today, real /user/signup later), then signs them in. */
  const signup = async ({
    fullName,
    email,
    password,
    role,
    remember = true,
  }) => {
    try {
      const { user: account, token } = await authService.signUp({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role,
      });

      const session = toSession({ user: account, token });
      const store = remember ? localStorage : sessionStorage;
      store.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
      return { ok: true, landing: ROLE_LANDING[account.role] };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  /** Returns 'full' | 'view' | 'none' for a given module key, based on the current role. */
  const hasAccess = (moduleKey) => {
    if (!user) return "none";
    return ROLE_PERMISSIONS[user.role]?.[moduleKey] || "none";
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      hasAccess,
      landingFor: (role) => ROLE_LANDING[role],
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
