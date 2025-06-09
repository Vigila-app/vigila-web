"use server";
import { ApiService } from "@/src/services";
import { getUUID, isServer } from "@/src/utils/common.utils";
import { initAdmin } from "@/server/supabaseAdmin";

export const NotifyUser = async ({
  userId,
  subtitle,
  target,
  title,
  url,
}: {
  userId: string;
  subtitle?: string;
  title: string;
  target?: "push" | "email";
  url?: string;
}) => {
  try {
    if (!isServer) return;
    // TODO switch case push | email
    await initAdmin();
    const firestore = getFirestore();
    const devices = await firestore.doc(`users-devices/${userId}`).get();
    if (devices?.data()) {
      const activeDevices = Object.values(devices.data() || {})
        .filter((device) => device.active)
        .map((device) => device.deviceId);
      if (activeDevices.length) {
        ApiService.post(
          "https://api.onesignal.com/notifications",
          {
            app_id: process.env.NEXT_PUBLIC_ONE_SIGNAL_APP_ID,
            name: getUUID("NOTIFICATION"),
            include_subscription_ids: activeDevices,
            target_channel: target || "push",
            contents: {
              en: title,
            },
            subtitle: {
              en: subtitle,
            },
            url,
          },
          {
            headers: {
              Authorization: process.env.ONE_SIGNAL_API_KEY as string,
            },
          }
        );
      }
    } else {
      console.log("No active devices to notify");
    }
  } catch (error) {
    console.error("NotificationsService notifyUser error", error);
  }
};
