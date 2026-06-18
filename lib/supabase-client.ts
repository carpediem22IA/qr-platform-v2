import { createClient } from "@supabase/supabase-js";

// ========================================
// CLIENTE DE SUPABASE PARA SUBIDA DIRECTA
// ========================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);