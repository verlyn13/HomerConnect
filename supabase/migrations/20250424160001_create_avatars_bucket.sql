-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', TRUE, FALSE, 5242880, '{image/png,image/jpeg,image/gif}')
ON CONFLICT (id) DO NOTHING;
