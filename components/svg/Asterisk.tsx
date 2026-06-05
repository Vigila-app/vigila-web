import type { SVGProps } from "react";
import { IconShell } from "./IconShell";

export const Asterisk = (props: SVGProps<SVGSVGElement>) => (
  <IconShell viewBox="0 0 24 24" {...props}>
    <path d="M12 5V19" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M5.93 8.5L18.07 15.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.07 8.5L5.93 15.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconShell>
);
