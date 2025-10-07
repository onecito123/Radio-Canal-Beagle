import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwuerzmhuzzbgwxtsavu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dWVyem1odXp6Ymd3eHRzYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MDMyOTQsImV4cCI6MjA3NTM3OTI5NH0.Ocs5K4cEhusY4K5I1GpxhgG13ap8mOlqgr49KyTkLPU';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
