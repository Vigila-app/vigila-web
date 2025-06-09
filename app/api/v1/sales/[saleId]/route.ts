import { initAdmin, validateAuth } from "@/server/supabaseAdmin";
import { ResponseCodesConstants } from "@/src/constants";
import { AuthService } from "@/src/services";
import { SaleI } from "@/src/types/sales.types";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

const unauthorizedError = () =>
  NextResponse.json(
    {
      code: ResponseCodesConstants.SALES_DETAILS_UNAUTHORIZED.code,
      success: false,
    },
    { status: 401 }
  );

const requestHandler = async (
  req: Request,
  context: { params: { saleId: SaleI["id"] } }
) => {
  const { method } = req;
  const {
    params: { saleId },
  } = context;

  if (!saleId) {
    return NextResponse.json(
      {
        code: ResponseCodesConstants.SALES_DETAILS_BAD_REQUEST.code,
        success: false,
      },
      { status: 400 }
    );
  }

  console.log(`API ${method} sales/${saleId}`);

  const { authToken, user } = AuthService.getAuthHeaders(req.headers);

  if (!(user && authToken)) {
    return unauthorizedError();
  }

  /*if (// TODO check roles) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.SALES_DETAILS_FORBIDDEN.code,
          success: false,
        },
        { status: 403 }
      );
    }*/

  try {
    await validateAuth(user, authToken);
  } catch (error) {
    return unauthorizedError();
  }

  switch (method) {
    case "GET": {
      try {
        await initAdmin();

        const firestore = getFirestore();
        const response = await firestore.doc(`sales/${saleId}`).get();
        if (response) {
          if (response.data()) {
            return NextResponse.json(
              {
                code: ResponseCodesConstants.SALES_DETAILS_SUCCESS.code,
                data: response?.data(),
                success: true,
              },
              { status: 200 }
            );
          } else {
            return NextResponse.json(
              {
                code: ResponseCodesConstants.SALES_DETAILS_NOT_FOUND.code,
                success: false,
              },
              { status: 404 }
            );
          }
        } else {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.SALES_DETAILS_ERROR.code,
              success: false,
              show: true,
            },
            { status: 500 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.SALES_DETAILS_ERROR.code,
            success: false,
            show: true,
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
          code: ResponseCodesConstants.SALES_DETAILS_METHOD_NOT_ALLOWED.code,
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
  context: { params: { saleId: SaleI["id"] } }
) {
  return requestHandler(req, context);
}
