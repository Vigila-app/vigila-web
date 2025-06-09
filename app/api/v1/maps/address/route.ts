import { NextResponse } from "next/server";

import { ApiService } from "@/src/services/api.service";
import { ResponseCodesConstants } from "@/src/constants";

const requestHandler = async (req: Request) => {
  const { method } = req;

  console.log(`API ${method} maps/address`);

  switch (method) {
    case "POST": {
      try {
        const body = await req.json();
        if (!body) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.MAPS_ADDRESS_BAD_REQUEST.code,
              success: false,
            },
            { status: 400 }
          );
        }
        const response = await ApiService.get(
          "https://nominatim.openstreetmap.org/search",
          { ...body, format: "json" }
        );

        return NextResponse.json(
          {
            code: ResponseCodesConstants.MAPS_ADDRESS_SUCCESS.code,
            data: response,
            success: true,
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.MAPS_ADDRESS_ERROR.code,
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
          code: ResponseCodesConstants.MAPS_ADDRESS_METHOD_NOT_ALLOWED.code,
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
