import { AppInstance } from "@/src/utils/supabase.utils";
import { ErrorMessages } from "@/src/constants/errorMessages.constants";

const errorHanlder = (error: any) => {
  switch (error?.code) {
    case "storage/object-not-found":
      console.error(ErrorMessages.FILE.NOT_FOUND);
      break;
    case "storage/unauthorized":
      console.error(ErrorMessages.FILE.NO_PERMISSION);
      break;
    case "storage/canceled":
      console.error(ErrorMessages.FILE.UPLOAD_CANCELED);
      break;

    case "storage/unknown":
    default:
      console.error(ErrorMessages.FILE.UNKNOWN_ERROR);
      break;
  }
};

export const StorageUtils = {
  getURL: async (bucket: string, pathToFile: string) => {
    try {
      if (!(bucket && pathToFile)) return pathToFile;
      const { data } = await AppInstance.storage
        .from(bucket)
        .createSignedUrl(pathToFile, 60 * 60); // 1 hour

      return data?.signedUrl;
    } catch (error) {
      errorHanlder(error);
    }
  },
  uploadFile: async (
    bucket: string,
    file: string | ArrayBuffer | File,
    pathToFile: string,
    metadata = {}
  ) =>
    new Promise<{
      id: string;
      path: string;
      fullPath: string;
    }>(async (resolve, reject) => {
      try {
        if (!(file && pathToFile)) {
          reject();
        }
        const { data, error } = await AppInstance.storage
          .from(bucket)
          .upload(pathToFile, file, {
            ...{ ...metadata, name: undefined },
            cacheControl: "3600",
            upsert: true,
          });
        if (error || !data) {
          reject(error);
        }
        resolve(
          data as {
            id: string;
            path: string;
            fullPath: string;
          }
        );
      } catch (error) {
        reject(error);
      }
    }),
  getSessionValues: (key: string) => localStorage.getItem(key) || "{}",
  setSessionValues: (key: string, data: string | Record<string, unknown>) => {
    const value =
      typeof data === "string"
        ? data
        : JSON.stringify({ ...data, session_timestamp: new Date().getTime() });
    localStorage.setItem(key, value);
  },
  clearSessionValues: (key?: string) => {
    if (key) {
      localStorage.removeItem(key);
    } else {
      localStorage.clear();
    }
  },
};
