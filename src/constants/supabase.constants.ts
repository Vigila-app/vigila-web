export const SupabaseConstants: {[key: string]: string} = {
  apiKey: process.env.NEXT_PUBLIC_SUPABASE_API_KEY as string,
  authDomain: process.env.NEXT_PUBLIC_SUPABASE_AUTH_DOMAIN as string,
  projectId: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID as string,
};

export const SupabaseErrors = {
  USER_EXIST: "auth/email-already-in-use",
};
