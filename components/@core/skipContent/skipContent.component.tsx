"use client";

import { focusId } from "@/src/utils/common.utils";
import { isServer } from "@/src/utils/common.utils";

const skipLinkList = [
  { label: "Menu", id: "Menu" },
  { label: "Main Content", id: "MainContent" },
];

const SkipContentComponent = () => {
  const skipToContent = (id: string) => {
    focusId(id);
  };

  if (isServer) return;

  return (
    <>
      {skipLinkList.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className="skip-main"
          onClick={() => skipToContent(link.id)}
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.preventDefault();
              skipToContent(link.id);
            }
          }}
          tabIndex={0}
          aria-label={`skip to ${link.label}`}
        >
          {link.label}
        </a>
      ))}
    </>
  );
};

export default SkipContentComponent;
