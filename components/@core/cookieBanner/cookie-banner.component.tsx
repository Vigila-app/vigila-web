"use client";

import { useEffect, useState } from "react";
import { CookieUtils } from "@/src/utils/cookie.utils";
import { Button } from "@/components";
import { Toggle } from "@/components/form";
import { CmsService } from "@/src/services";
import { CmsPageI } from "@/src/types/cms.types";
import Link from "next/link";
import { Routes } from "@/src/routes";
import { usePathname } from "next/navigation";
import { NavigationUtils } from "@/src/utils/navigation.utils";

const CookieBannerComponent = () => {
  const pathname = usePathname();
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showCookiePreferences, setShowCookiePreferences] = useState(false);
  const [cookiesFlag, setCookiesFlag] = useState<{
    [cookieId: string]: boolean;
  }>({
    "cookie-essential": true,
    "cookie-functional": true,
    "cookie-analytics": true,
    "cookie-profiling": true,
  });
  const [cmsData, setCmsData] = useState<CmsPageI>({});

  const closeCookieBanner = () => {
    const flags = { ...cookiesFlag };
    if (!showCookiePreferences) {
      Object.values(cmsData.form?.fields || {}).forEach((field) => {
        flags[field.id] = true;
      });
    }
    CookieUtils.setCookie(
      CookieUtils.CookieCheck,
      JSON.stringify({
        timestamp: new Date().getTime(),
        visible: false,
        ...flags,
      }),
      30
    );
    setShowCookieBanner(false);
    setShowCookiePreferences(false);
  };

  const checkCookie = () => {
    const cookie = JSON.parse(
      CookieUtils.getCookie(CookieUtils.CookieCheck) || "{}"
    );
    setShowCookieBanner(!Object.values(cookie)?.length || cookie?.visible);
  };

  const getCmsData = async () => {
    try {
      const response = await CmsService.getLocalPage("cookie-policy");
      setCmsData(response);
    } catch (error) {
      throw new Error("Failed to fetch cookie-policy data");
    }
  };

  const reloadCookieFlags = () => {
    const cookie = JSON.parse(
      CookieUtils.getCookie(CookieUtils.CookieCheck) || "{}"
    );
    if (Object.values(cookie)?.length) {
      const flags = { ...cookiesFlag };
      Object.values(cmsData.form?.fields || {}).forEach((field) => {
        if (cookie[field.id] != null) {
          flags[field.id] = cookie[field.id];
        } else {
          flags[field.id] = true;
        }
      });
      setCookiesFlag(flags);
    }
  };

  useEffect(() => {
    checkCookie();
    getCmsData();
  }, []);

  useEffect(() => {
    if (cmsData?.form?.fields?.length) reloadCookieFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmsData?.form?.fields]);

  useEffect(() => {
    const route = NavigationUtils.getRouteByUrl(pathname);
    if (route?.url === Routes.cookiePolicy.url) {
      setShowCookieBanner(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!showCookieBanner) return null;

  return (
    <div className="fixed bottom-0 w-full z-50">
      <div className="relative">
        <section
          aria-label="cookies banner"
          id="cookies-banner"
          className="mx-auto max-w-screen-lg w-full sticky bottom-0 rounded text-center p-4 border border-gray-200 bg-white shadow transition"
        >
          <div className="flex flex-wrap w-full items-center justify-center gap-4">
            <div className="overflow-y-scroll max-h-96">
              <div className="w-full text-sm">
                <h2 className="text-lg font-medium">{cmsData.title}</h2>
                <p className="p-2 text-left">
                  {cmsData.text}
                  <br />
                  <div>
                    Learn more about our&nbsp;
                    <Link
                      className="underline transition hover:font-medium"
                      href={Routes.cookiePolicy.url}
                    >
                      {Routes.cookiePolicy.label}
                    </Link>
                  </div>
                  {showCookiePreferences ? (
                    <div className="mt-4">
                      {cmsData.form?.fields?.length ? (
                        <ul className="p-2 pt-0 w-full flex flex-wrap gap-2 divide-y divide-gray-200/50">
                          {cmsData.form.fields.map((field) => (
                            <li key={field.id} className="w-full pt-2">
                              <div className="w-full w-full inline-flex items-center justify-between">
                                <label className="font-medium">
                                  {field.label}
                                </label>
                                {field.required ? (
                                  <strong>Always active</strong>
                                ) : (
                                  <Toggle
                                    label={field.label}
                                    withIcon
                                    checked={cookiesFlag[field.id]}
                                    value={field.id}
                                    onChange={({ target: { checked } }) => {
                                      setCookiesFlag({
                                        ...cookiesFlag,
                                        [field.id]: checked,
                                      });
                                    }}
                                  />
                                )}
                              </div>
                              {field.text ? <p>{field.text}</p> : null}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                </p>
              </div>
              {!showCookiePreferences ? (
                <Button
                  action={() =>
                    setShowCookiePreferences(!showCookiePreferences)
                  }
                  text
                  label="Show preferences"
                />
              ) : null}
            </div>
            <Button
              action={closeCookieBanner}
              primary
              label={
                !showCookiePreferences ? "Accept all Cookies" : "Save and Apply"
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default CookieBannerComponent;
