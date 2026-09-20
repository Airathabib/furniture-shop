'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthModal } from '@/components/layout/auth-modal/AuthModal';
import { getCurrentUserId } from '@/lib/auth-utils';

export default function RegisterPage() {
  const router = useRouter();
  const userId = getCurrentUserId();

  useEffect(() => {
    if (userId) {
      router.push('/');
    }
  }, [userId, router]);

  return (
    <div className='container mx-auto px-4 py-16 flex justify-center min-h-[60vh]'>
      <AuthModal
        isOpen={true}
        onClose={() => router.push('/')}
        initialMode='register'
      />
    </div>
  );
}
