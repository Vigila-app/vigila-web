import { apiPublicSearch, apiNoticeBoard } from "@/src/constants/api.constants";
import { ApiService } from "@/src/services/api.service";
import { NoticeBoardFormI } from "@/src/types/notice-board.types";

export const PublicSearchService = {
  searchServices: async (params: {
    captcha: string;
    postalCode?: string;
    city?: string;
    lat?: number;
    lon?: number;
  }) => ApiService.post(apiPublicSearch.SEARCH(), params),
};

export const NoticeBoardService = {
  createNotice: async (notice: NoticeBoardFormI) =>
    ApiService.post(apiNoticeBoard.CREATE(), notice),

  getNotices: async (params?: { page?: number; itemPerPage?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.itemPerPage)
      searchParams.set("itemPerPage", String(params.itemPerPage));
    const url = `${apiNoticeBoard.LIST()}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return ApiService.get(url);
  },
};
