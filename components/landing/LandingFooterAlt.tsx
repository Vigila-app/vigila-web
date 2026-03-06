"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export type FooterLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon?: ReactNode;
};

export type LandingFooterAltProps = {
  primaryLinks: FooterLink[];
  infoLinks: FooterLink[];
  contactEmail: string;
  socialLinks: SocialLink[];
};

const LandingFooterAlt = ({ primaryLinks, infoLinks, contactEmail, socialLinks }: LandingFooterAltProps) => {
  return (
    <footer className="bg-[#062534] px-4 py-12 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row md:justify-between">
        <div className="space-y-3">
          <Image src="/assets/logo_white.png" alt="Vigila" width={96} height={28} />
          <p className="text-sm text-white/80">Con affetto.</p>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold">Servizi</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {primaryLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Informazioni</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Contatti</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>
                <a href={`mailto:${contactEmail}`} className="hover:text-white">
                  {contactEmail}
                </a>
              </li>
            </ul>
            <div className="mt-4 space-y-2 text-sm text-white/80">
              <p className="font-semibold text-white">Seguici</p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <Link key={social.label} href={social.href} className="hover:text-white" aria-label={social.label}>
                    {social.icon ?? <span className="text-sm">{social.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Vigila. Un ponte tra generazioni.
      </div>
    </footer>
  );
};

export default LandingFooterAlt;
