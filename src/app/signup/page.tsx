/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/signup', form);
      // optionally auto-login; for now just redirect
      router.push('/login');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Signup failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-center">Create account</h1>
        {error && <p className="p-3 text-sm rounded bg-red-100 text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
            autoComplete="new-password"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>
        <p className="text-sm text-center">
          Already have an account? <Link href="/login" className="text-blue-600 underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
