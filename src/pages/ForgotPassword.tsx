import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail, validateRequired } from '@/utils/validation';
import { handleApiError } from '@/utils/errorHandling';

/**
 * Forgot Password page component
 */
export function ForgotPassword() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [errors, setErrors] = useState<{
    email?: string;
    code?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Automatically log out user when they access forgot password page
  useEffect(() => {
    const logoutUser = async () => {
      if (isAuthenticated) {
        try {
          await logout();
          setMessage('You have been logged out to reset your password.');
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
    };
    logoutUser();
  }, [isAuthenticated, logout]);

  const validateEmailStep = (): boolean => {
    const newErrors: typeof errors = {};

    if (!validateRequired(email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetStep = (): boolean => {
    const newErrors: typeof errors = {};

    if (!validateRequired(code)) {
      newErrors.code = 'Verification code is required';
    }

    if (!validateRequired(newPassword)) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmailStep()) {
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ username: email });
      setStep('reset');
      setMessage('Password reset code sent to your email');
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateResetStep()) {
      return;
    }

    setIsLoading(true);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      });
      // Redirect to login page after successful password reset
      navigate('/login', { 
        state: { 
          message: 'Password reset successful! You can now log in with your new password.' 
        } 
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 animated-bg">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            <span className="gradient-text">Reset Password</span>
          </h1>
          <p className="text-slate-600 text-lg">
            {step === 'email' 
              ? 'Enter your email to receive a reset code'
              : 'Enter the code and your new password'
            }
          </p>
        </div>

        <div className="glass-effect rounded-3xl shadow-2xl border border-white/20 p-8">
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{message}</p>
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendCode}>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
                placeholder="you@example.com"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending code...' : 'Send Reset Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <Input
                label="Verification Code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                error={errors.code}
                required
                placeholder="123456"
                maxLength={6}
              />

              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={errors.newPassword}
                required
                placeholder="••••••••"
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                required
                placeholder="••••••••"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mb-4"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting password...' : 'Reset Password'}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => setStep('email')}
              >
                Back to Email
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Remember your password?{' '}
              <Link to="/login" className="text-violet-600 hover:text-violet-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}