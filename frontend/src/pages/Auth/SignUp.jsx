import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import TextInput from '@/components/forms/Input/TextInput';
import Select from '@/components/forms/Select/Select';
import Button from '@/components/forms/Button/Button';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/permissions';
import { useAuth } from '@/context/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Dispatcher');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Fill in every field to create your account.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    const result = await signup({ fullName, email, password, role });
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(result.landing || ROUTES.DASHBOARD, { replace: true });
  };

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-text-900">Create your account</h2>
      <p className="mt-1 text-sm text-text-400">Sign up to get started with TransitOps.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextInput
          label="Full Name"
          value={fullName}
          onChange={setFullName}
          placeholder="Raven K."
          disabled={loading}
        />
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="raven.k@transitops.in"
          disabled={loading}
        />
        <TextInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          disabled={loading}
        />
        <TextInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="••••••••"
          disabled={loading}
        />
        <Select stacked label="Sign up as" options={ROLES} value={role} onChange={setRole} disabled={loading} />

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-status-danger/30 bg-status-danger-bg px-3 py-2 text-xs text-status-danger">
            <AlertTriangle size={14} strokeWidth={2} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign Up'}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-text-400">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-amber-600 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
