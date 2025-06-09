import { isMocked } from "@/src/utils/envs.utils";
import { ApiService } from "@/src/services";
import { apiCms } from "@/src/constants/api.constants";
import { CmsContentType } from "@/src/enums/cms.enums";
import { isServer } from "@/src/utils/common.utils";
//import { FirestoreUtils } from "@/src/utils/firestore.utils";

export const CmsService = {
  /*getPage: async (pageId: string) =>
    new Promise<{
      [key: string]: string | number | {} | (string | number)[] | {};
    }>(async (resolve, reject) => {
      try {
        if (isMocked) {
          const mockCms = await CmsService.getLocalPage(pageId);
          resolve(mockCms);
        } else {
          console.log("CmsService getPage request for page", pageId);
          if (isServer) {
            const cmsResponseSSR = await ApiService.get<FirestoreResponseI>(
              apiCms.CONTENT_SSR(`content-pages/${pageId}`)
            );
            if (cmsResponseSSR) {
              const response = FirestoreUtils.transformResponse(cmsResponseSSR);
              if (response) {
                resolve(response);
              } else {
                reject();
              }
            } else {
              reject();
            }
          } else {
            const { data: cmsResponse } =
              (await ApiService.get<{ data: FirestoreResponseI }>(
                apiCms.CONTENT(CmsContentType.PAGE, pageId)
              )) || {};
            if (cmsResponse) {
              const response = FirestoreUtils.transformResponse(cmsResponse);
              if (response) {
                resolve(response);
              } else {
                reject();
              }
            } else {
              reject();
            }
          }
        }
      } catch (error) {
        console.error("CmsService getPage error", pageId, error);
        reject(error);
      }
    }),*/
  getLocalPage: async (pageId: string) =>
    new Promise<{
      [key: string]: string | number | {} | (string | number)[] | {};
    }>(async (resolve, reject) => {
      try {
        const mockCms = await import(`@/mock/cms/${pageId}.json`);
        resolve(mockCms);
      } catch (error) {
        if (isMocked) {
          const mockCms = await import(`@/mock/cms/samplePage.json`);
          resolve(mockCms);
        } else {
          console.error("CmsService getLocalPage error", pageId, error);
          reject(error);
        }
      }
    }),
};
