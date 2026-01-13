'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type TabKey = 'perspective' | 'dialogue' | 'exchange' | 'profile';

const tabs: { key: TabKey; label: string; href: string }[] = [
  { key: 'perspective', label: 'Perspective', href: '/debate' },
  { key: 'dialogue', label: 'Dialogue', href: '/dialogue' },
  { key: 'exchange', label: 'Exchange', href: '/exchange' },
  { key: 'profile', label: 'Profile', href: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const activeKey: TabKey | null =
    pathname.startsWith('/debate')
      ? 'perspective'
      : pathname.startsWith('/dialogue')
        ? 'dialogue'
        : pathname.startsWith('/exchange')
          ? 'exchange'
          : pathname.startsWith('/profile')
            ? 'profile'
            : null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-center bg-black/95 border-t border-gray-800">
      <div className="w-full max-w-md flex justify-between px-6 py-3 text-xs">
        {tabs.map((tab) => {
          const isActive = activeKey === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => router.push(tab.href)}
              className={cn(
                'flex flex-col items-center gap-1 text-[11px]',
                isActive ? 'text-white' : 'text-gray-500',
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full mb-0.5',
                  isActive 
                    ? tab.key === 'dialogue' 
                      ? 'bg-green-500' 
                      : 'bg-pink-500'
                    : 'bg-gray-700',
                )}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}


