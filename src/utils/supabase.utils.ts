import { SupabaseConstants } from "@/src/constants/supabase.constants";

const supabaseConfig = {
  apiKey: SupabaseConstants.apiKey,
  authDomain: SupabaseConstants.authDomain,
  projectId: SupabaseConstants.projectId,
};


import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const AppInstance = createClient(supabaseConfig.authDomain, supabaseConfig.apiKey)

