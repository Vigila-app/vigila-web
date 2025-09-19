import { AppConstants } from "@/src/constants";
import { isMocked } from "@/src/utils/envs.utils";
import Script from "next/script";

const CommonScript = () => {
  return (
    <>
      {!isMocked ? (
        <Script id="csq-script" strategy="afterInteractive">
          {`
            (function (c, s, q, u, a, r, e) {
            c.hj=c.hj||function(){(c.hj.q=c.hj.q||[]).push(arguments)};
            c._hjSettings = { hjid: a };
            r = s.getElementsByTagName('head')[0];
            e = s.createElement('script');
            e.async = true;
            e.src = q + c._hjSettings.hjid + u;
            r.appendChild(e);
            })(window, document, 'https://static.hj.contentsquare.net/c/csq-', '.js', ${AppConstants.cs_id});
    `}
        </Script>
      ) : null}
    </>
  );
};

export default CommonScript;
