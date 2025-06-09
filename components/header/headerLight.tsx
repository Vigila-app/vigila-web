import Link from "next/link";
import { Routes } from "@/src/routes";
import { Logo } from "@/components";

type HeaderLightI = {
  withLogo?: boolean;
};

const HeaderLight = (props: HeaderLightI) => {
  const { withLogo = true } = props;
  return (
    <header className="relative bg-white shadow z-50">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            {withLogo ? (
              <Link className="block text-primary-500" href={Routes.home.url}>
                <span className="sr-only">{Routes.home.label}</span>
                <Logo size="small" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderLight;
