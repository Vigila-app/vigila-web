import Image from "next/image";
import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
};

type PartnerFooterProps = {
  links?: FooterLink[];
};

const defaultLinks: FooterLink[] = [
  { label: "Per le famiglie", href: "/" },
  { label: "Per i caregiver", href: "/auth/registration/vigil" },
  { label: "Partner", href: "/partner" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Cookie policy", href: "/cookie-policy" },
  { label: "Contatti", href: "mailto:info@vigila.it" },
];

const PartnerFooter = ({ links = defaultLinks }: PartnerFooterProps) => {
  return (
    <footer className="bg-[#062534] px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <Link href="/" className="shrink-0">
          <Image
            src="/assets/logo_white.png"
            alt="Vigila"
            width={88}
            height={26}
          />
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Vigila. Un ponte tra generazioni.
      </div>
    </footer>
  );
};

export default PartnerFooter;
