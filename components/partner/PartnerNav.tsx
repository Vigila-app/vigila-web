"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

type NavLink = {
  label: string;
  href: string;
  isAnchor?: boolean;
};

type PartnerNavProps = {
  links: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  sticky?: boolean;
};

const PartnerNav = ({
  links,
  ctaLabel,
  ctaHref,
  sticky = true,
}: PartnerNavProps) => {
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header
      className={clsx(
        "z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm",
        sticky && "sticky top-0"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/assets/logo.png"
            alt="Vigila"
            width={88}
            height={26}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={
                link.isAnchor
                  ? (e) => handleAnchorClick(e, link.href)
                  : undefined
              }
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            onClick={
              ctaHref.startsWith("#")
                ? (e) => handleAnchorClick(e, ctaHref)
                : undefined
            }
            className="inline-flex items-center justify-center rounded-full bg-consumer-blue px-5 py-2 text-sm font-semibold text-white shadow hover:bg-consumer-blue/90 transition shrink-0"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </header>
  );
};

export default PartnerNav;
