import Link from "next/link";
import dynamic from "next/dynamic";
import { Routes } from "@/src/routes";
import Menu from "@/components/menu/menu";
import { Logo } from "@/components";
import clsx from "clsx";

const HeaderProfile = dynamic(
  () => import("@/components/header/headerProfile"),
  { ssr: !!false }
);
const MenuMobile = dynamic(() => import("@/components/menu/menuMobile"), {
  ssr: !!false,
});
const MenuPrivate = dynamic(() => import("@/components/menu/menuPrivate"), {
  ssr: !!false,
});

type HeaderI = {
  withLogo?: boolean;
};

const Header = (props: HeaderI) => {
  const { withLogo = true } = props;
  return (
    <header className="relative bg-white shadow z-50">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div
          className={clsx(
            "flex h-16 items-center",
            withLogo ? "justify-between" : "justify-end"
          )}
        >
          {withLogo && (
            <Link className="mr-12" href={Routes.home.url}>
              <span className="sr-only">{Routes.home.label}</span>
              <Logo size="small" />
            </Link>
          )}

          <div className="flex items-center gap-4">
            <Menu />
            <MenuPrivate />
            <HeaderProfile />
            <div className="block md:hidden">
              <MenuMobile />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
