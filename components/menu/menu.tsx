import { NavigationUtils } from "@/src/utils/navigation.utils";
import clsx from "clsx";
import Link from "next/link";

const Menu = () => {
  return (
    <nav aria-label="menu" className="hidden md:block" id="Menu">
      <ul className="flex items-center gap-6 text-sm">
        {NavigationUtils.getHeaderMenu().map((route) => (
          <li
            key={route.label}
            className={clsx(
              route.menu?.mobile ? "block" : "hidden",
              `sm:${route.menu?.desktop ? "block" : "hidden"}`
            )}
          >
            <Link
              className="text-primary-500 transition hover:text-primary-700"
              href={route.url}
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
