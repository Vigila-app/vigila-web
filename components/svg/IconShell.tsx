// src/components/icons/IconShell.tsx
import React from "react";

export const IconShell = ({
  children,
  viewBox = "0 0 24 24",
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={viewBox}
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
};