-- Allow authenticated users to insert their own profile rows
CREATE POLICY "Authenticated users can create profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
