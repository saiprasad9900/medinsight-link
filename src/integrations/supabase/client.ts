
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://atuafkshrqypvpsqgnxk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0dWFma3NocnF5cHZwc3FnbnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MzQwMDEsImV4cCI6MjA1NjMxMDAwMX0.EjEhaqQ6F7euA482zDFaZ4SWmTw7MweuGAN-c-5_zbY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
