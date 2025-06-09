// @ts-nocheck
"use client";
import { AppConstants } from "@/src/constants";
import { Routes } from "@/src/routes";
import { UserService } from "@/src/services";
import { isReleased } from "@/src/utils/envs.utils";
import Script from "next/script";
import { useEffect } from "react";

const InitOneSignal = () => {
  const enrollDevice = (event) => {
    console.log("enroll device", event);
    if (event?.current?.token && event?.current?.id) {
      UserService.updateDevices({
        [event.current.id]: {
          active: event.current.optedIn || false,
          deviceId: event.current.id,
          lastUpdate: new Date(),
        },
      });
      //this is a good place to call OneSignal.login and pass in your user ID
      OneSignal.login(event.current.id);
    }
  };

  useEffect(() => {
    if (window.OneSignalDeferred) {
      window.OneSignalDeferred.push(function () {
        OneSignal.User.PushSubscription.addEventListener(
          "change",
          enrollDevice
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.OneSignalDeferred]);

  if (!isReleased) return;
  return (
    <>
      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        defer={true}
      ></Script>
      <Script id="one-signal-init">
        {`window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async function(OneSignal) {
          await OneSignal.init({
            appId: "${process.env.NEXT_PUBLIC_ONE_SIGNAL_APP_ID}",
            safari_web_id: "web.onesignal.auto.49d2239d-a04e-422a-89e0-14dbda97fb4d",
            notifyButton: {
              enable: true,
              showCredit: false,
            },
            welcomeNotification: {
              disable: true,
            },
            serviceWorkerParam: { scope: "/push/oneSignal/" },
            serviceWorkerPath: "push/oneSignal/OneSignalSDKWorker.js",
          });
        });
        window.OneSignalDeferred.push(function() {
          OneSignal.Notifications.setDefaultUrl("${AppConstants.hostUrl}${Routes.notifications.url}");
        });
        window.OneSignalDeferred.push(function() {
          OneSignal.Notifications.setDefaultTitle("${AppConstants.title}");
        });`}
      </Script>
    </>
  );
};

export default InitOneSignal;
