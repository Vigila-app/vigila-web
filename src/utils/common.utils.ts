import { CurrencyEnum, FrequencyEnum } from "@/src/enums/common.enums";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { ToastI } from "@/src/types/toast.type";

export const isServer = typeof window === "undefined";

export const downloadFile = (
  file: string,
  fileName: string,
  target = "file-target"
) => {
  const link = document.createElement("a");
  link.setAttribute("href", file);
  link.setAttribute("download", fileName);
  const targetRef = document.getElementById(target);
  if (targetRef) {
    targetRef.appendChild(link);
    link.click();
    targetRef.removeChild(link);
  } else {
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
};

export const scrollTo = (y: number) => {
  if (!isServer)
    window.scrollTo({
      behavior: "smooth",
      left: 0,
      top: y,
    });
};

export const scrollToId = (id: string, ref?: HTMLElement) => {
  let element = ref;
  if (!ref && !isServer) {
    element = document.querySelector(`#${id}`) as HTMLElement;
  }
  if (element) {
    scrollTo(element.offsetTop);
  }
};

export const focusId = (id: string, scroll = true) => {
  if (!isServer) {
    const elementToFocus = document.querySelector(`#${id}`) as HTMLElement;
    if (elementToFocus) {
      elementToFocus?.setAttribute("tabindex", "0");
      if (scroll) {
        scrollToId(id, elementToFocus);
      }
      elementToFocus?.focus({ preventScroll: true });
      elementToFocus.onblur = () => {
        elementToFocus?.removeAttribute("tabindex");
      };
    }
  }
};

export const calcDelay = (qty: number, frequency: FrequencyEnum) => {
  switch (frequency) {
    case FrequencyEnum.SECONDS:
    default:
      return qty;
    case FrequencyEnum.MINUTES:
      return qty * 60;
    case FrequencyEnum.HOURS:
      return qty * (60 * 60);
    case FrequencyEnum.DAYS:
      return qty * (60 * 60 * 24);
    case FrequencyEnum.MONTHS:
      return qty * (60 * 60 * 24 * 30);
    case FrequencyEnum.YEARS:
      return qty * (60 * 60 * 24 * 365);
  }
};

export const encodeFile = (base64: string) => {
  let encodedFile = base64?.toString().replace(/^data:(.*,)?/, "");
  if (encodedFile?.length && encodedFile.length % 4 > 0) {
    encodedFile += "=".repeat(4 - (encodedFile.length % 4));
  }
  return encodedFile;
};

export const resizeImage = (
  base64: string,
  height: number = 250,
  width: number = 250
) =>
  new Promise(function (resolve) {
    var img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")?.drawImage(img, 0, 0, height, width);

      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.src = base64;
  });

export const copyToClipboard = async (
  text: string,
  notify: boolean = false,
  customToast: ToastI = {
    message: "Content copied succesfully!",
    type: ToastStatusEnum.SUCCESS,
  }
) => {
  try {
    if (!isServer) await navigator.clipboard.writeText(text);
    if (notify) {
      useAppStore.getState().showToast(customToast);
    }
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

export const replaceDynamicUrl = (
  url: string,
  valueToReplace: string,
  dynamicValue: string | number
) => url.replace(valueToReplace, (dynamicValue || "").toString());

export const shareContent = ({
  title,
  description,
  url,
}: {
  title: string;
  description?: string;
  url: string;
}) => {
  if (navigator?.share) {
    navigator.share({
      title,
      text: description || title,
      url,
    });
  }
};

export const getUUID = (root = "") =>
  `${root}${new Date().getTime().toString()}`;

export const EurConverter = (cents: number): number => {
  if (!cents) return 0;

  let num = Math.abs(cents).toString();

  num = num.padStart(3, "0");

  const formatted = num.replace(/^(\d+)(\d{2})$/, "$1.$2");
  const finalNumber = parseFloat(formatted);
  return cents < 0 ? -finalNumber : finalNumber;
};

export const amountFormatter = (amount: number) =>
  Math.round((amount + Number.EPSILON) * 100) / 100;

export const amountDisplay = (amount: number, currency?: CurrencyEnum) =>
  `${currency || ""}${amountFormatter(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const timestampToDate = (timestamp: any) => {
  try {
    return new Date(
      // @ts-ignore
      (timestamp.seconds || timestamp["_seconds"]) * 1000 +
        // @ts-ignore
        (timestamp.nanoseconds || timestamp["_nanoseconds"]) / 1000000
    );
  } catch (error) {
    console.error("transformTimestamp error:", error);
  }
};

export const formatBookingDate = (dateString: string): string => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const capitalize = (text: string) =>
  text ? text[0].toUpperCase() + text.slice(1).toLowerCase() : text;

export const randomNumber = (min = 0, max = 100) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
};

export const deepMerge = (target: any, source: any) => {
  if (typeof target !== "object" || target === null) return source;
  if (typeof source !== "object" || source === null) return target;

  const merged = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        merged[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        merged[key] = source[key];
      }
    }
  }

  return merged;
};

// Map per gestire multiple chiamate debounced con chiavi diverse
const timeouts = new Map<string, NodeJS.Timeout>();

export const debounce = (
  key: string,
  callback: (...args: any) => void,
  delay = 500
) => {
  // Cancella il timeout precedente per questa chiave specifica
  const existingTimeout = timeouts.get(key);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  // Imposta un nuovo timeout
  const newTimeout = setTimeout(() => {
    callback();
    timeouts.delete(key); // Pulisce la mappa dopo l'esecuzione
  }, delay);

  timeouts.set(key, newTimeout);
};

// Funzione per creare un debouncer con chiave automatica
export const createDebouncer = (baseKey: string, delay = 500) => {
  return (callback: (...args: any) => void, suffix = "") => {
    const key = suffix ? `${baseKey}_${suffix}` : baseKey;
    debounce(key, callback, delay);
  };
};

export const getCurrency = (currency: CurrencyEnum) => {
  switch (currency) {
    case CurrencyEnum.EURO:
      return "eur";
    case CurrencyEnum.US_DOLLAR:
      return "usd";
    case CurrencyEnum.GB_POUND:
      return "gbp";
    default:
      return (currency as string).toLowerCase();
  }
};

export function mergeGoogleAndFormData(googleRawData: any, formData: any) {
  // formData contiene: { role, terms, userId } che arrivano dal modal/API

  const sourceName = (
    googleRawData.full_name ||
    googleRawData.name ||
    ""
  ).trim();
  let finalName = sourceName || "";
  let finalSurname = "";

  const lastSpaceIndex = sourceName.lastIndexOf(" ");

  if (lastSpaceIndex !== -1) {
    finalName = sourceName.slice(0, lastSpaceIndex);

    finalSurname = sourceName.slice(lastSpaceIndex + 1);
  }

  return {
    ...googleRawData,

    user_id: formData.userId,
    name: finalName,
    surname: finalSurname,
    role: formData.role,
    level: "BASE",
    status: "pending",
    displayName: sourceName,
    terms: formData.terms,
    email_verified: true, 
  };
}
