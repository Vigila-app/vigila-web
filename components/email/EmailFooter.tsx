/* eslint-disable @next/next/no-img-element */
import * as React from "react";
// Use direct PNGs for emails to ensure broad client compatibility
import { AppConstants } from "@/src/constants";

interface EmailFooterProps {
  small?: boolean;
  copyrightText?: string;
}

export function EmailFooter({
  small = false,
  copyrightText,
}: EmailFooterProps) {
  return (
    <div
      style={{
        backgroundColor: "#00161F",
        padding: small ? "12px" : "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          maxWidth: "600px",
          margin: "0 auto",
          marginBottom: "8px",
        }}
      >
        <img
          src={`${AppConstants.publicUrl}/assets/logo_white.png`}
          alt="Vigila"
          style={{ width: small ? 96 : 140, height: "auto" }}
        />
      </div>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <a
          href={AppConstants.whatsappUrl}
          style={{ textDecoration: "none" }}
          aria-label="WhatsApp"
        >
          <img
            src="https://s2.svgbox.net/social.svg?ic=discourse&color=8E8E8E"
            alt="WhatsApp"
            width={20}
            height={20}
            style={{ display: "block" }}
          />
        </a>

        <a
          href={AppConstants.instagramUrl}
          style={{ textDecoration: "none" }}
          aria-label="Instagram"
        >
          <img
            src="https://s2.svgbox.net/social.svg?ic=instagram&color=8E8E8E"
            alt="Instagram"
            width={20}
            height={20}
            style={{ display: "block" }}
          />
        </a>
      </div>
      <br />
      <p
        style={{
          color: "#8E8E8E",
          fontSize: "12px",
          margin: 0,
        }}
      >
        {copyrightText ||
          `© ${new Date().getFullYear()} Vigila. Tutti i diritti riservati.`}
      </p>
    </div>
  );
}

export default EmailFooter;
