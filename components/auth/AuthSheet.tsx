'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthSheetProps {
  open: boolean;
  mode: 'signup' | 'login';
  onModeChange: (mode: 'signup' | 'login') => void;
  onClose: () => void;
  onAuthenticated: () => void;
}

export function AuthSheet({
  open,
  mode,
  onModeChange,
  onClose,
  onAuthenticated,
}: AuthSheetProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // For now we simulate auth; later this can call a real API (e.g. AWS Cognito)
      await new Promise((resolve) => setTimeout(resolve, 600));
      onAuthenticated();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Auth error', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60">
      <div className="relative w-full max-w-sm bg-black text-white rounded-t-3xl pt-6 pb-8 px-5">
        {/* Close handle */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 rounded-full p-1 text-gray-400 hover:text-white"
          aria-label="Close authentication"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="h-16 w-16 rounded-full flex items-center justify-center bg-white">
            <Image
              src="/Zentrais Flaticon 150x150-03.png"
              alt="Zentrais logo"
              width={56}
              height={56}
            />
          </div>
        </div>

        {/* Mode toggle titles */}
        <div className="flex justify-center mb-2">
          {mode === 'signup' ? (
            <h2 className="text-lg font-semibold">Sign up to post your thoughts</h2>
          ) : (
            <h2 className="text-lg font-semibold">Login to Your Account</h2>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auth-email" className="text-xs text-gray-300">
              Email
            </Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-black border-gray-700 text-white placeholder:text-gray-500"
              placeholder="johndoe@gmail.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-password" className="text-xs text-gray-300">
              Password
            </Label>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-black border-gray-700 text-white placeholder:text-gray-500"
              placeholder="********"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-gray-200 mt-2"
            disabled={loading}
          >
            {loading
              ? mode === 'signup'
                ? 'Creating Account...'
                : 'Logging In...'
              : mode === 'signup'
                ? 'Create Account'
                : 'Log In'}
          </Button>

          <div className="text-center text-xs text-gray-400 mt-2">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => onModeChange('login')}
                  className="text-pink-400 underline-offset-2 hover:underline"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => onModeChange('signup')}
                  className="text-pink-400 underline-offset-2 hover:underline"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
            <div className="flex-1 h-px bg-gray-700" />
            <span>OR</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full justify-center border-gray-700 text-gray-200 hover:bg-gray-900"
            disabled
          >
            Continue with Google (soon)
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center border-gray-700 text-gray-200 hover:bg-gray-900"
            disabled
          >
            Continue with Apple (soon)
          </Button>
        </form>
      </div>
    </div>
  );
}


