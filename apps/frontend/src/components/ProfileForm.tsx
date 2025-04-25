"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import AvatarUpload from './AvatarUpload';
import BannerPicker from './BannerPicker';

/**
 * Shape of profile data from Supabase
 */
export interface ProfileData {
  id: string;
  email: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  tagline?: string;
  accent_color?: string;
  interests?: string[];
}

interface ProfileFormProps {
  /** Initial data for form fields; undefined if creating new */
  initialData?: ProfileData | null;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [displayName, setDisplayName] = useState(initialData?.display_name || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || '');
  const [bannerUrl, setBannerUrl] = useState(initialData?.banner_url || '');
  const [tagline, setTagline] = useState(initialData?.tagline || '');
  const [interests, setInterests] = useState((initialData?.interests || []).join(', '));
  const [accentColor, setAccentColor] = useState(initialData?.accent_color || '#000000');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) {
      setErrorMsg('You must be logged in to update your profile.');
      setIsLoading(false);
      return;
    }
    const payload = {
      id: user.id,
      email: user.email,
      display_name: displayName,
      bio: bio,
      avatar_url: avatarUrl,
      banner_url: bannerUrl,
      tagline: tagline,
      accent_color: accentColor,
      interests: interests.split(',').map(i => i.trim()).filter(i => i),
    };
    const { error } = await supabase.from('profiles').upsert(payload);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Profile saved successfully!');
      setTimeout(() => router.push('/profile'), 1500);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">
        {initialData ? 'Edit Profile' : 'Create Profile'}
      </h1>
      {errorMsg && <div className="text-red-600">{errorMsg}</div>}
      {successMsg && <div className="text-green-600">{successMsg}</div>}
      <BannerPicker
        initialUrl={initialData?.banner_url || null}
        onUpload={(url) => setBannerUrl(url)}
      />
      <AvatarUpload
        initialUrl={initialData?.avatar_url || null}
        onUpload={(url) => setAvatarUrl(url)}
      />
      <div>
        <label htmlFor="tagline" className="block mb-1 font-medium">Tagline</label>
        <input
          id="tagline"
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="interests" className="block mb-1 font-medium">Interests (comma separated)</label>
        <input
          id="interests"
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="accentColor" className="block mb-1 font-medium">Accent Color</label>
        <input
          id="accentColor"
          type="color"
          value={accentColor}
          onChange={(e) => setAccentColor(e.target.value)}
          className="w-full h-10 p-1 border rounded"
        />
      </div>
      <div>
        <label htmlFor="displayName" className="block mb-1 font-medium">
          Display Name
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="bio" className="block mb-1 font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}
