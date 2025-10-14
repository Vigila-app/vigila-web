import { Resend } from "resend";
import { EmailConstants } from "@/src/constants/email.constants";
import {
  EmailWithTemplateI,
  EmailWithHtmlI,
  EmailResponseI,
} from "@/src/types/email.types";
import { isReleased } from "@/src/utils/envs.utils";

// Verifica che la API key sia configurata
if (!process.env.RESEND_API_KEY) {
  throw new Error(
    "RESEND_API_KEY è richiesta ma non è stata configurata nelle variabili d'ambiente"
  );
}

// Istanza globale di Resend
const ResendInstance = new Resend(process.env.RESEND_API_KEY);

const calcSender = (from?: string) => {
  if (from) {
    return isReleased
      ? from.trim()
      : EmailConstants.devEmail.replace(
          "delivered+${email}",
          from.trim().replace("@", "--")
        );
  }
  return isReleased
    ? EmailConstants.defaultFrom
    : `${EmailConstants.devEmail.replace(
        "delivered+${email}",
        EmailConstants.defaultFrom.replace("@", "--").replace(">", "")
      )}>`;
};

const calcRecipient = (to: string | string[]) => {
  if (Array.isArray(to)) {
    return to
      .map((recipient) =>
        isReleased
          ? recipient.trim()
          : EmailConstants.devEmail.replace(
              "${email}",
              recipient.trim().replace("@", "--")
            )
      )
      .join(", ");
  }
  return isReleased
    ? to.trim()
    : EmailConstants.devEmail.replace("${email}", to.trim().replace("@", "--"));
};

export const ResendService = {
  sendEmailWithTemplate: async (options: EmailWithTemplateI) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        const body = {
          from: calcSender(options.from),
          to: calcRecipient(options.to),
          subject: options.subject,
          react: options.react,
          replyTo: options.replyTo,
          text: await (async () => {
            if (options.text) return options.text;
            try {
              // dynamic import to avoid bundling react-dom/server into client bundles
              const rds = await import("react-dom/server");
              const renderToStaticMarkup = rds.renderToStaticMarkup as (
                element: any
              ) => string;
              // render the react element to static HTML and strip tags to obtain plain text
              const html = options.react ? renderToStaticMarkup(options.react) : "";
              return html.replace(/<[^>]*>/g, "").trim() || undefined;
            } catch (e) {
              // fallback: attempt to stringify children or return undefined
              try {
                return options.react?.props?.children?.toString?.() || undefined;
              } catch (ee) {
                return undefined;
              }
            }
          })(),
        };
        if (!isReleased) {
          console.log("Invio email con template:", body);
        }
        const result = await ResendInstance.emails.send(body);

        resolve({
          success: true,
          data: result.data || null,
          error: null,
        });
      } catch (error) {
        console.error("ResendService sendEmailWithTemplate error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Errore sconosciuto";
        resolve({
          success: false,
          data: null,
          error: errorMessage,
        });
      }
    }),

  sendEmailWithHtml: async (options: EmailWithHtmlI) =>
    new Promise<EmailResponseI>(async (resolve, reject) => {
      try {
        const body = {
          from: calcSender(options.from),
          to: calcRecipient(options.to),
          subject: options.subject,
          html: options.html,
          text: options.text || options.html.replace(/<[^>]*>/g, ""),
          replyTo: options.replyTo,
        };
        if (!isReleased) {
          console.log("Invio email con HTML:", body);
        }
        const result = await ResendInstance.emails.send(body);

        resolve({
          success: true,
          data: result.data || null,
          error: null,
        });
      } catch (error) {
        console.error("ResendService sendEmailWithHtml error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Errore sconosciuto";
        resolve({
          success: false,
          data: null,
          error: errorMessage,
        });
      }
    }),
};
