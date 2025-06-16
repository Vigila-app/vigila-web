import { NextResponse } from "next/server";
import { AuthService } from "@/src/services";
import { ResponseCodesConstants } from "@/src/constants";
import { initAdmin, validateAuth } from "@/server/supabaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

const unauthorizedError = () =>
  NextResponse.json(
    {
      code: ResponseCodesConstants.USER_DEVICES_UNAUTHORIZED.code,
      success: false,
    },
    { status: 401 }
  );

const requestHandler = async (
  req: Request,
  context: { params: { uid: string } }
) => {
  const { method } = req;
  const {
    params: { uid },
  } = context;

  console.log(`API ${method} user/${uid}/devices`);

  const { authToken, user } = AuthService.getAuthHeaders(req.headers);

  if (!authToken || !user || !uid || uid !== user) {
    return unauthorizedError();
  }

  /*if (//TODO check role) {
    return NextResponse.json(
      {
        code: ResponseCodesConstants.USER_DEVICES_FORBIDDEN.code,
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
        const response = await firestore.doc(`users-devices/${uid}`).get();
        if (response) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.USER_DEVICES_SUCCESS.code,
              data: response?.data(),
              success: true,
            },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.USER_DEVICES_ERROR.code,
              success: false,
              show: true,
            },
            { status: 500 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.USER_DEVICES_ERROR.code,
            success: false,
            show: true,
          },
          { status: 500 }
        );
      }
      break;
    }
    case "PUT": {
      try {
        const body = await req.json();
        if (!body || !Object.values(body)?.length) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.USER_DEVICES_BAD_REQUEST.code,
              success: false,
            },
            { status: 400 }
          );
        }
        await initAdmin();
        const firestore = getFirestore();
        const docRef = firestore.doc(`users-devices/${uid}`);
        await docRef.set(body, { merge: true });

        return NextResponse.json(
          {
            code: ResponseCodesConstants.USER_DEVICES_SUCCESS.code,
            data: body,
            success: true,
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.USER_DEVICES_ERROR.code,
            success: false,
          },
          { status: 500 }
        );
      }
      break;
    }
    default: {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.USER_DEVICES_METHOD_NOT_ALLOWED.code,
          success: false,
        },
        { status: 405 }
      );
      break;
    }
  }
};

export async function GET(req: Request, context: { params: { uid: string } }) {
  return requestHandler(req, context);
}

export async function PUT(req: Request, context: { params: { uid: string } }) {
  return requestHandler(req, context);
}
