import { NextResponse } from "next/server";

import { ApiService } from "@/src/services/api.service";
import { ResponseCodesConstants } from "@/src/constants";

const requestHandler = async (req: Request) => {
  const { method } = req;

  console.log(`API ${method} maps/poi/search`);

  switch (method) {
    case "POST": {
      try {
        const body = await req.json();
        if (!body) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.MAPS_POI_SEARCH_BAD_REQUEST.code,
              success: false,
            },
            { status: 400 }
          );
        }
        const response = await ApiService.get(
          "https://discover.search.hereapi.com/v1/discover",
          body
        );

        return NextResponse.json(
          {
            code: ResponseCodesConstants.MAPS_POI_SEARCH_SUCCESS.code,
            data: response,
            success: true,
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.MAPS_POI_SEARCH_ERROR.code,
            success: false,
            error,
          },
          { status: 500 }
        );
      }
      break;
    }
    default: {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.MAPS_POI_SEARCH_METHOD_NOT_ALLOWED.code,
          success: false,
        },
        { status: 405 }
      );
      break;
    }
  }
};

export async function POST(req: Request) {
  return requestHandler(req);
}
