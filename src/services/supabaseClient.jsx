import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aardcqfdouqqclgsnftl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcmRjcWZkb3VxcWNsZ3NuZnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTI1MDEsImV4cCI6MjA3NjM4ODUwMX0.dg68zI7tWF_J0D5i8iK90e9LF6sjA_3JpMPYkLNyRHU";

export const supabase = createClient(supabaseUrl, supabaseKey);

