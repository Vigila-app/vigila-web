import type { SVGProps } from "react";
import { IconShell } from "./IconShell";

export const NonBinary = (props: SVGProps<SVGSVGElement>) => (
  <IconShell viewBox="0 0 24 24" {...props}>
    {/* Cerchio centrale */}
    <path
      d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Asta verticale */}
    <path d="M12 6V2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Braccio X sinistra-alto a destra-basso */}
    <path d="M9 1L15 5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Braccio X destra-alto a sinistra-basso */}
    <path d="M15 1L9 5" strokeLinecap="round" strokeLinejoin="round" />
  </IconShell>
);
