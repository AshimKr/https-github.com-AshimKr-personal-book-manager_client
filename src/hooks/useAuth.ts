'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// redirect to /login when no token found
export default function useAuth() {
  const router = useRouter();
  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) router.replace('/login');
    } catch {
      router.replace('/login');
    }
  }, [router]);
}
