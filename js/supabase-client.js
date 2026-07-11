// Shared Supabase client — anon key only (safe for browser use, protected by RLS policies).
// Never put the service_role key here or in any client-side file.
const SUPABASE_URL = 'https://nyhakfjvrxlfwymvjfcl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55aGFrZmp2cnhsZnd5bXZqZmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDg5NTYsImV4cCI6MjA5NTE4NDk1Nn0.iA_SNzXuaee1T-llZmjfEsrtOkH94E0p1E3eCwDf_60';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
