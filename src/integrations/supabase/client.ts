// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://atuafkshrqypvpsqgnxk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0dWFma3NocnF5cHZwc3FnbnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MzQwMDEsImV4cCI6MjA1NjMxMDAwMX0.EjEhaqQ6F7euA482zDFaZ4SWmTw7MweuGAN-c-5_zbY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);