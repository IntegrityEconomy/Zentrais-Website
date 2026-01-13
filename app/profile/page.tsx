'use client';

import { BottomNav } from '@/components/app/BottomNav';

export default function ProfilePage() {
  return (
    <>
      <div className="container mx-auto py-10 px-4 max-w-md pb-24">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full border border-gray-700 flex items-center justify-center text-gray-400">
            @username
          </div>
          <h1 className="text-xl font-semibold mb-1">Profile</h1>
          <p className="text-xs text-gray-500">Zentrais Inc ©2025 — Version 1.0</p>
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
          <button className="w-full text-left px-4 py-3 bg-black hover:bg-gray-900 text-red-400">
            Log Out
          </button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}


