import { NextResponse } from "next/server";
import { ResponseCodesConstants } from "@/src/constants";
import { AuthService } from "@/src/services";
import { initAdmin, validateAuth } from "@/server/supabaseAdmin";
import { SaleI } from "@/src/types/sales.types";

const unauthorizedError = () =>
  NextResponse.json(
    {
      code: ResponseCodesConstants.SALES_LIST_UNAUTHORIZED.code,
      success: false,
    },
    { status: 401 }
  );

const requestHandler = async (req: Request) => {
  const { method } = req;

  console.log(`API ${method} sales`);

  const { authToken, user } = AuthService.getAuthHeaders(req.headers);

  if (!(user && authToken)) {
    return unauthorizedError();
  }

  /*if (// TODO check roles) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.SALES_LIST_FORBIDDEN.code,
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

        const collection = await firestore
          .collection(`users-sales`)
          .where(FieldPath.documentId(), "==", user)
          .limit(1)
          .get();
        const results: { [key: string]: SaleI }[] = [];
        collection.forEach((doc) => results.push(doc.data()));
        return NextResponse.json(
          {
            code: ResponseCodesConstants.SALES_LIST_SUCCESS.code,
            data: results?.length
              ? Object.values(results[0]).filter(
                  (sale) => sale?.creationDate
                )
              : [],
            success: true,
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.SALES_LIST_ERROR.code,
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
          code: ResponseCodesConstants.SALES_LIST_METHOD_NOT_ALLOWED.code,
          success: false,
        },
        { status: 405 }
      );
      break;
    }
  }
};

export async function GET(req: Request) {
  return requestHandler(req);
}

export async function POST(req: Request) {
  return requestHandler(req);
}
