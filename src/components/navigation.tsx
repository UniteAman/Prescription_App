'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth, signOut } from '@/lib/auth';

export default function Navigation() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
  };

  const navItems = [
    { href: '/profile', label: 'Profile' },
    { href: '/appointments', label: 'Appointments' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-primary-600">
            Prescription App
          </Link>
          
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
