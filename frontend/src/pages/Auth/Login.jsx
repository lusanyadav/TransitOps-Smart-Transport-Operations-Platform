import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import TextInput from '@/components/forms/Input/TextInput';
import Select from '@/components/forms/Select/Select';
import Checkbox from '@/components/forms/Checkbox/Checkbox';
import Button from '@/components/forms/Button/Button';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/permissions';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Dispatcher');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [locked, setLocked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (locked) return;

    if (!email || !password) {
      setError('Enter your work email and password to continue.');
      return;
    }

    const result = login({ email, password, role, remember });
    if (!result.ok) {
      setError(result.error);
      setLocked(!!result.locked);
      return;
    }

    setError('');
    const redirectTo = location.state?.from;
    navigate(redirectTo && redirectTo !== ROUTES.LOGIN ? redirectTo : result.landing || ROUTES.DASHBOARD, {
      replace: true,
    });
  };

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-text-900">Sign in to your account</h2>
      <p className="mt-1 text-sm text-text-400">Enter your credentials to continue.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="raven.k@transitops.in"
          disabled={locked}
        />
        <TextInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          disabled={locked}
        />
        <Select stacked label="Sign in as" options={ROLES} value={role} onChange={setRole} disabled={locked} />

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-status-danger/30 bg-status-danger-bg px-3 py-2 text-xs text-status-danger">
            <AlertTriangle size={14} strokeWidth={2} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" checked={remember} onChange={setRemember} disabled={locked} />
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs font-medium text-amber-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={locked}>
          {locked ? 'Account Locked' : 'Sign In'}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-text-400">
        Access is scoped by role · Role-Based Access Control (RBAC)
      </p>

      <details className="mt-4 rounded-lg border border-line-soft bg-paper px-3 py-2 text-xs text-text-400">
        <summary className="cursor-pointer font-medium text-text-600">Demo credentials</summary>
        <ul className="mt-2 space-y-1">
          <li>Fleet Manager · fleet.manager@transitops.in / Fleet@123</li>
          <li>Dispatcher · dispatcher@transitops.in / Dispatch@123</li>
          <li>Safety Officer · safety.officer@transitops.in / Safety@123</li>
          <li>Financial Analyst · finance.analyst@transitops.in / Finance@123</li>
        </ul>
      </details>
    </AuthLayout>
  );
}
