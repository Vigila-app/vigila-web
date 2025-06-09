import { SupabaseConstants } from "@/src/constants/supabase.constants";
import { isServer } from "@/src/utils/common.utils";
import { AppInstance } from "@/src/utils/supabase.utils";
import { createClient, User } from "@supabase/supabase-js";

export function initAdmin() {
  try {
    if (isServer) {
      const admin = createClient(
        SupabaseConstants.authDomain,
        process.env.SUPABASE_API_SECRET_KEY as string,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

      // Access admin api
      return admin;
    }
  } catch (error) {
    console.error("SupabaseAdmin init error", error);
  }
}

export const validateAuth = async (id: string, token: string) =>
  new Promise<User | string>(async (resolve, reject) => {
    try {
      if (!(id && token)) {
        reject("Unauthorized");
      }

      const admin = initAdmin();
      if (!admin) {
        reject("Service unavailable");
      }

      const {
        data: { user },
        error,
      } = (await AppInstance.auth.getUser(token)) as {
        data: { user: User };
        error: any;
      };

      if (error || user?.id !== id) {
        reject("Forbidden");
      }

      resolve(user);
    } catch (error) {
      console.error("SupabaseAdmin validateAuth error", error);
      reject(error);
    }
  });
