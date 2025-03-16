/*
  # Authentication Schema Setup
  
  1. Security
    - Enable Row Level Security (RLS) on auth.users
    - Add policies for user data access
    
  2. Changes
    - Add custom fields to auth.users if needed in the future
    - Set up initial RLS policies
*/

-- Enable RLS on auth.users (if not already enabled)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own data"
  ON auth.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);