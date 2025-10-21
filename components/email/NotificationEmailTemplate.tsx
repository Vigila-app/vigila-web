import * as React from "react";
import { EmailHeader } from "./EmailHeader";
import { EmailFooter } from "./EmailFooter";

interface NotificationEmailProps {
  subject: string;
  content: React.ReactNode | string;
  appUrl?: string;
}

export function NotificationEmailTemplate({
  subject,
  content,
}: NotificationEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "0 auto",
      }}
    >
      <EmailHeader title={subject} subtitle={undefined} />

      <div
        style={{
          padding: "20px",
          backgroundColor: "#ffffff",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <div style={{ color: "#666", fontSize: "16px", lineHeight: "1.6" }}>
          {typeof content === "string" ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            content
          )}
        </div>
      </div>

      <EmailFooter />
    </div>
  );
}

export default NotificationEmailTemplate;
