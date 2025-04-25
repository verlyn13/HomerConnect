import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';

export default async function ProfilePage() {
  const supabase = createClient(cookies());
  // Get authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    // If not authenticated, redirect to login
    redirect('/login');
  }

  // Fetch profile for the authenticated user (profiles.id is the user UUID)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // Handle query errors
  if (profileError) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h1 className="text-xl font-bold mb-2">Error Loading Profile</h1>
          <p className="text-red-600">{profileError.message}</p>
          <p className="mt-4">
            <a href="/" className="text-blue-600 hover:underline">Return to Home</a>
          </p>
        </div>
      </div>
    );
  }

  // No profile row yet
  if (!profile) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="text-center py-12 px-6 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Welcome to HomerConnect!</h1>
          <p className="text-lg text-gray-600 mb-6">
            You don&apos;t have a profile yet. Creating a profile helps you connect with others in the Homer community.
          </p>
          <a
            href="/profile/edit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition inline-block"
          >
            Create Your Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <a
          href="/profile/edit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Edit Profile
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Header section with avatar and name */}
        <div className="flex items-center space-x-4 p-6 border-b">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="Avatar"
              width={96}
              height={96}
              className="rounded-full object-cover w-24 h-24"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-2xl text-white">
                {user.email?.charAt(0).toUpperCase() ?? '?'}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{profile.display_name || user.email}</h2>
            {profile.email && (
              <p className="text-gray-500">{profile.email}</p>
            )}
          </div>
        </div>

        {/* Bio section */}
        {profile.bio && (
          <div className="p-6 border-b">
            <h3 className="text-sm uppercase text-gray-500 font-medium mb-2">About</h3>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        {/* Details section */}
        <div className="p-6">
          <h3 className="text-sm uppercase text-gray-500 font-medium mb-3">Details</h3>
          <div className="space-y-3">
            {profile.interests?.length > 0 && (
              <div>
                <span className="font-medium">Interests: </span>
                <span className="text-gray-700">
                  {profile.interests.join(', ')}
                </span>
              </div>
            )}
            <div>
              <span className="font-medium">Member since: </span>
              <span className="text-gray-700">
                {new Date(profile.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
