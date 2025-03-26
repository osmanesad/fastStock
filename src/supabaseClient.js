import { createClient } from '@supabase/supabase-js';

// Supabase URL ve Anonim Anahtarınızı buraya yerleştirin
const supabaseUrl = 'https://pqyxwaiavntmszklofjq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxeXh3YWlhdm50bXN6a2xvZmpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NTgwNzMsImV4cCI6MjA1MDEzNDA3M30.O1Hknv5oSWTSjcPEsGr5C3S3W2tMA-wcEBvrYbk5-FE';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
