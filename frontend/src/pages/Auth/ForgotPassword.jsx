import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import TextInput from '@/components/forms/Input/TextInput';
import Button from '@/components/forms/Button/Button';
import { ROUTES } from '@/constants/routes';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-text-900">Reset your password</h2>
      <p className="mt-1 text-sm text-text-400">We'll send a reset link to your work email.</p>

      {sent ? (
        <div className="mt-6 rounded-lg border border-status-success/30 bg-status-success-bg p-3 text-sm text-status-success">
          If an account exists for {email}, a reset link is on its way.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <TextInput label="Email" type="email" value={email} onChange={setEmail} placeholder="raven@transitops.com" />
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      )}

      <Link to={ROUTES.LOGIN} className="mt-6 block text-center text-xs font-medium text-amber-600 hover:underline">
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
