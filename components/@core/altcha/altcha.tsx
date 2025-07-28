"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import "altcha";
import { apiAltcha } from "@/src/constants/api.constants";

type AltchaProps = {
  onStateChange?: (evt: CustomEvent) => void;
  floating?: boolean;
};

const Altcha = forwardRef<{ value: string | null }, AltchaProps>(
  ({ onStateChange, floating = false }, ref) => {
    const widgetRef = useRef<HTMLElement>(null);
    const [value, setValue] = useState<string | null>(null);

    useImperativeHandle(
      ref,
      () => {
        return {
          get value() {
            return value;
          },
        };
      },
      [value]
    );

    useEffect(() => {
      const handleStateChange = (ev: Event | CustomEvent) => {
        if ("detail" in ev) {
          setValue(ev.detail.payload || null);
          onStateChange?.(ev);
        }
      };

      const { current } = widgetRef;

      if (current) {
        current.addEventListener("statechange", handleStateChange);
        return () =>
          current.removeEventListener("statechange", handleStateChange);
      }
    }, [onStateChange]);

    return (
      <altcha-widget
        ref={widgetRef}
        style={{
          "--altcha-max-width": "10rem",
        }}
        floating={floating}
        challengeurl={apiAltcha.CHALLENGE()}
      ></altcha-widget>
    );
  }
);

Altcha.displayName = "Altcha";

export default Altcha;
