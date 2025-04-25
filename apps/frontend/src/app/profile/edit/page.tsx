import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import ProfileForm from '@/components/ProfileForm';

export const metadata: Metadata = {
  title: 'Edit Profile',
};

/**
 * Server-side component for editing a user profile.
 * Fetches existing profile data and renders the client-side ProfileForm.
 */
export default async function EditProfilePage() {
  const supabase = createClient(cookies());
  // Ensure user is authenticated
  const { data: authData, error: userError } = await supabase.auth.getUser();
  const user = authData.user;
  if (userError || !user) {
    redirect('/login');
  }

  // Fetch existing profile (could be null)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (profileError) {
    throw new Error(profileError.message);
  }

  return <ProfileForm initialData={profile} />;
}
