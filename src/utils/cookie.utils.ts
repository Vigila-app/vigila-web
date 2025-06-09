export const CookieUtils = {
  CookieCheck: "cookiesBanner",
  getCookie: (name: string) => {
    const value = " " + document.cookie;
    const parts = value.split(" " + name + "=");
    return parts?.length < 2 ? undefined : parts.pop()?.split(";").shift();
  },

  setCookie: (
    name: string,
    value: string,
    expiryDays?: string | number,
    domain?: string,
    path?: string,
    secure?: string
  ) => {
    const exdate = new Date();
    exdate.setHours(
      exdate.getHours() +
        (typeof expiryDays !== "number" ? 365 : expiryDays) * 24
    );
    document.cookie =
      name +
      "=" +
      value +
      ";expires=" +
      exdate.toUTCString() +
      ";path=" +
      (path || "/") +
      (domain ? ";domain=" + domain : "") +
      (secure ? ";secure" : "");
  },
};
