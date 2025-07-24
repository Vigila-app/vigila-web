import { NextResponse } from "next/server";

import { ApiService } from "@/src/services/api.service";
import { ResponseCodesConstants } from "@/src/constants";
import { apiCms } from "@/src/constants/api.constants";
import { CmsContentType } from "@/src/enums/cms.enums";

const requestHandler = async (
  req: Request,
  context: { params: Promise<{ contentType: CmsContentType; contentId: string }> }
) => {
  const { contentType, contentId } = await context.params;
  const { method } = req;

  if (!(contentType && contentId)) {
    return NextResponse.json(
      {
        code: ResponseCodesConstants.USER_DETAILS_BAD_REQUEST.code,
        success: false,
      },
      { status: 400 }
    );
  }

  console.log(`API ${method} cms/${contentType}/${contentId}`);

  const getPathToContetType = () => {
    switch (contentType) {
      case "page":
        return "content-pages";
      case "item":
        return "content-item";
      default:
        return;
    }
  };

  switch (method) {
    case "GET": {
      try {
        const response = await ApiService.get(
          `${apiCms.CONTENT_SSR(`${getPathToContetType()}/${contentId}`)}`
        );
        return NextResponse.json(
          {
            code: ResponseCodesConstants.CMS_CONTENT_SUCCESS.code,
            data: response,
            success: true,
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.CMS_CONTENT_ERROR.code,
            success: false,
            show: true,
          },
          { status: 500 }
        );
      }
      break;
    }
    default: {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.CMS_CONTENT_METHOD_NOT_ALLOWED.code,
          success: false,
        },
        { status: 405 }
      );
      break;
    }
  }
};

export async function GET(
  req: Request,
  context: { params: Promise<{ contentType: CmsContentType; contentId: string }> }
) {
  return requestHandler(req, context);
}
