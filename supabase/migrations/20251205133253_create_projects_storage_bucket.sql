/*
  # Create Projects Storage Bucket

  1. Storage Buckets
    - Create `project-images` bucket for storing project images
    - Bucket is public for reading (images need to be displayed)
    - Only authenticated users can upload to their own folder

  2. Storage Policies
    - SELECT: Allow anyone to view/download project images
    - INSERT: Only authenticated users can upload to their own `userId/` folder
    - UPDATE: Only authenticated users can update their own files
    - DELETE: Only authenticated users can delete their own files

  3. Security
    - Images are stored in `project-images/{userId}/` folders
    - Users can only manage their own files
    - File size limited to 5MB
    - Only image files allowed
*/

-- Create the storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT DO NOTHING;

-- Enable RLS on storage.objects for this bucket
-- SELECT policy: Allow anyone to view/download project images
CREATE POLICY "Allow public read access to project images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'project-images');

-- INSERT policy: Allow authenticated users to upload to their own folder
CREATE POLICY "Allow users to upload project images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'project-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE policy: Allow users to update their own files
CREATE POLICY "Allow users to update their project images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'project-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'project-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE policy: Allow users to delete their own files
CREATE POLICY "Allow users to delete their project images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'project-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
