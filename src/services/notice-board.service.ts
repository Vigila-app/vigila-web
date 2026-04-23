import { apiPublicSearch, apiNoticeBoard } from "@/src/constants/api.constants";
import { ApiService } from "@/src/services/api.service";
import { NoticeBoardFormI, NoticeBoardI } from "@/src/types/notice-board.types";

export const PublicSearchService = {
  searchServices: async (params: {
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

  getNoticeDetails: async (noticeId: NoticeBoardI["id"]): Promise<NoticeBoardI> => {
    try {
      if (!noticeId) throw new Error("Notice ID is required");
      const response = await ApiService.get<{ data: NoticeBoardI }>(
        apiNoticeBoard.DETAILS(noticeId),
      );
      if (response?.data) return response.data;
      throw new Error("Notice not found");
    } catch (error) {
      console.error("NoticeBoardService getNoticeDetails error", error);
      throw error;
    }
  },

  proposeForNotice: async (noticeId: string) =>
    ApiService.post(apiNoticeBoard.PROPOSE(noticeId), {}),
};
