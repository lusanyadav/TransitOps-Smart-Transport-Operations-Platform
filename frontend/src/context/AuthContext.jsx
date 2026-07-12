import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MOCK_USERS, MAX_LOGIN_ATTEMPTS, ROLE_PERMISSIONS, ROLE_LANDING } from '@/constants/permissions';

const AuthContext = createContext(null);

const SESSION_KEY = 'transitops.session';
const ATTEMPTS_KEY = 'transitops.loginAttempts';

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
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession());

  useEffect(() => {
    // Keep tabs in sync if the user logs out elsewhere.
    const onStorage = (e) => {
      if (e.key === SESSION_KEY && !e.newValue) setUser(null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /**
   * Attempts a sign-in against the mock account fixture.
   * Tracks failed attempts per-email and locks the account after
   * MAX_LOGIN_ATTEMPTS, mirroring the mockup's error state.
   */
  const login = ({ email, password, role, remember }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const attempts = readAttempts();
    const record = attempts[normalizedEmail] || { count: 0, locked: false };

    if (record.locked) {
      return { ok: false, locked: true, error: 'Account locked after 5 failed attempts. Contact your administrator to reset access.' };
    }

    const account = MOCK_USERS.find((u) => u.email.toLowerCase() === normalizedEmail);
    const isMatch = account && account.password === password && account.role === role;

    if (!isMatch) {
      const nextCount = record.count + 1;
      const locked = nextCount >= MAX_LOGIN_ATTEMPTS;
      attempts[normalizedEmail] = { count: nextCount, locked };
      writeAttempts(attempts);

      if (locked) {
        return { ok: false, locked: true, error: 'Account locked after 5 failed attempts. Contact your administrator to reset access.' };
      }

      const remaining = MAX_LOGIN_ATTEMPTS - nextCount;
      const reason = account && account.password === password
        ? 'That account is not registered under the selected role.'
        : 'Invalid credentials.';
      return { ok: false, locked: false, error: `${reason} ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before lockout.` };
    }

    // Successful login resets the failed-attempt counter for this email.
    delete attempts[normalizedEmail];
    writeAttempts(attempts);

    const session = { email: account.email, name: account.name, role: account.role, initials: account.initials };
    const store = remember ? localStorage : sessionStorage;
    store.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true, landing: ROLE_LANDING[account.role] };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  /** Returns 'full' | 'view' | 'none' for a given module key, based on the current role. */
  const hasAccess = (moduleKey) => {
    if (!user) return 'none';
    return ROLE_PERMISSIONS[user.role]?.[moduleKey] || 'none';
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      hasAccess,
      landingFor: (role) => ROLE_LANDING[role],
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
