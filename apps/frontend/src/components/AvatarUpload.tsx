"use client";

import Image from "next/image";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { createClient } from "@/utils/supabase/client";

export interface AvatarUploadProps {
  /** Initial avatar URL to display */
  initialUrl?: string | null;
  /** Callback invoked with the public URL after successful upload */
  onUpload: (url: string) => void;
}

export default function AvatarUpload({
  initialUrl = null,
  onUpload,
}: AvatarUploadProps) {
  const supabase = createClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName;

    setUploading(true);
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      console.error("Avatar upload error:", uploadError.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    setPreviewUrl(urlData.publicUrl);
    onUpload(urlData.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <label className="block mb-1 font-medium">Avatar</label>
      <div className="mb-2">
        {previewUrl ? (
          <div className="relative w-24 h-24">
            <Image
              src={previewUrl}
              alt="Avatar preview"
              fill
              className="rounded-full object-cover"
              sizes="96px"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
    </div>
  );
}
