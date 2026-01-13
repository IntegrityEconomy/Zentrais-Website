'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check } from 'lucide-react';
import { BottomNav } from '@/components/app/BottomNav';
import { getStoredToken, getStoredUserId } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const token = getStoredToken();
    if (!token) {
      router.push('/login');
      return;
    }

    // Get the actual user ID from the JWT token
    const tokenUserId = getStoredUserId();
    setUserId(tokenUserId);

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error('Failed to parse user data');
      }
    }
  }, [router]);

  const handleCopyId = async () => {
    if (userId) {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      <div className="container mx-auto py-10 px-4 max-w-md pb-24">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 bg-gray-800">
            {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '@'}
          </div>
          <h1 className="text-xl font-semibold mb-1">{user?.name || 'Profile'}</h1>
          <p className="text-sm text-gray-400 mb-2">{user?.email}</p>
          
          {/* User ID Section - Copyable */}
          {userId && (
            <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-500 mb-1">Your User ID (share to chat)</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-sm text-green-400 font-mono bg-gray-800 px-2 py-1 rounded break-all">
                  {userId}
                </code>
                <button
                  onClick={handleCopyId}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                  title="Copy User ID"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-500 mt-1">Copied to clipboard!</p>
              )}
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-4">Zentrais Inc ©2025 — Version 1.0</p>
        </div>

        <div className="divide-y divide-gray-800 border border-gray-800 rounded-lg overflow-hidden text-sm">
          <button className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900">
            Edit Profile
          </button>
          <button className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900">
            Security &amp; Privacy
          </button>
          <button className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900">
            Account Settings
          </button>
          <button className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900">
            Help &amp; About Zentrais
          </button>
          <button className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900">
            Language
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900 text-red-400"
          >
            Log Out
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}


