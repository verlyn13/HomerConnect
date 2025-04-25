
'use client';

import { useEffect, useState } from 'react';
import { sendTest } from '../actions/sendTest';
import { createClient } from '@/utils/supabase/client';

export default function ApiTest() {
  const [status, setStatus] = useState<string>('Loading...');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('_manual_migrations').select('*').limit(1);
        if (error) throw error;
        setStatus('Connected successfully to Supabase!');
      } catch (error: any) {
        setStatus(`Connection error: ${error.message || 'Unknown error'}`);
      }
    }
    testConnection();
  }, [supabase]);

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await sendTest(email);
      setMessage(`Test email sent to ${email} via Next.js server action`);
    } catch (err) {
      setError(`Error sending test email: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupabaseEmailTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/update`,
      });

      if (error) {
        throw error;
      }

      setMessage(`Password reset email sent to ${email} via Supabase Auth`);
    } catch (err) {
      setError(`Error sending Supabase email: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">API Testing Page</h1>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Supabase Connection</h2>
        <p>{status}</p>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleTestEmail} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Test Next.js Email</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Test Email (Next.js)'}
        </button>
      </form>

      <form onSubmit={handleSupabaseEmailTest}>
        <h2 className="text-xl font-semibold mb-2">Test Supabase Auth Email</h2>
        <div className="mb-4">
          <label htmlFor="supabase-email" className="block mb-1">Email Address</label>
          <input
            id="supabase-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 text-white bg-purple-500 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Test Email (Supabase Auth)'}
        </button>
      </form>
    </div>
  );
}
