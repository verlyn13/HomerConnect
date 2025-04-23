
'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function ApiTest() {
  const [status, setStatus] = useState<string>('Loading...');
  const supabase = createClient();

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('_manual_migrations').select('*').limit(1);
        if (error) throw error;
        setStatus('Connected successfully to Supabase!');
      } catch (error) {
        setStatus(`Connection error: ${error.message}`);
      }
    }
    testConnection();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Supabase Connection Test</h1>
      <p>{status}</p>
    </div>
  );
}
