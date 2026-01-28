import "@/app/globals.css";
import { Metadata } from "next";
import { AppConstants } from "@/src/constants";
import HtmlDocument from "@/components/@core/htmlDocument/htmlDocument.component";

export const metadata: Metadata = {
  title: {
    template: `%s | ${AppConstants.title}`,
    default: AppConstants.title,
  },
  description: AppConstants.description,
  openGraph: {
    title: {
      template: `%s | ${AppConstants.title}`,
      default: AppConstants.title,
    },
    description: AppConstants.description,
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HtmlDocument>
      {children}
    </HtmlDocument>
  );
}
