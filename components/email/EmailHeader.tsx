/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { AppConstants } from "@/src/constants";

interface EmailHeaderProps {
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  titleColor?: string;
}

export function EmailHeader({
  title,
  subtitle,
  backgroundColor = "#fff",
  titleColor = "black",
}: EmailHeaderProps) {
  return (
    <div
      style={{
        backgroundColor,
        padding: "20px",
        textAlign: "center",
        borderBottom: "1px solid #ececec",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          maxWidth: "600px",
          margin: "0 auto",
          marginBottom: title || subtitle ? "12px" : 0,
        }}
      >
        <img
          src={`${AppConstants.publicUrl}/assets/logo.png`}
          alt="Vigila"
          style={{
            width: 140,
            height: "auto",
            display: "block",
            border: "none",
          }}
        />
      </div>

      {title && (
        <h1 style={{ color: titleColor, fontSize: "22px", margin: "6px 0" }}>
          {title}
        </h1>
      )}

      {subtitle && (
        <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>{subtitle}</p>
      )}
    </div>
  );
}

export default EmailHeader;
