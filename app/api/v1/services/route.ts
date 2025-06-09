import { NextResponse } from "next/server";
import { ResponseCodesConstants } from "@/src/constants";
import { AuthService } from "@/src/services";
import { initAdmin, validateAuth } from "@/server/supabaseAdmin";
import { getUUID } from "@/src/utils/common.utils";
import { ServiceI } from "@/src/types/services.types";
import { ServicesUtils } from "@/src/utils/services.utils";

const unauthorizedError = () =>
  NextResponse.json(
    {
      code: ResponseCodesConstants.SERVICES_CREATE_UNAUTHORIZED.code,
      success: false,
    },
    { status: 401 }
  );

const requestHandler = async (req: Request) => {
  const { method } = req;

  console.log(`API ${method} services`);

  const { authToken, user } = AuthService.getAuthHeaders(req.headers);

  if (!(user && authToken)) {
    return unauthorizedError();
  }

  /*if (// TODO check roles) {
    return NextResponse.json(
      {
        code: ResponseCodesConstants.SERVICES_CREATE_FORBIDDEN.code,
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
          .collection(`users-services`)
          .where(FieldPath.documentId(), "==", user)
          .limit(1)
          .get();
        const results: { [key: string]: ServiceI }[] = [];
        collection.forEach((doc) => results.push(doc.data()));
        return NextResponse.json(
          {
            code: ResponseCodesConstants.SERVICES_CREATE_SUCCESS.code,
            data: results?.length
              ? Object.values(results[0]).filter(
                  (service) => service?.creationDate
                )
              : [],
            success: true,
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.SERVICES_CREATE_ERROR.code,
            success: false,
            show: true,
            error,
          },
          { status: 500 }
        );
      }
      break;
    }
    case "POST": {
      try {
        const body: ServiceI = await req.json();

        const newService = await ServicesUtils.createNewService(body);

        if (!(newService.ownerId && newService.name && newService.price)) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.SERVICES_CREATE_BAD_REQUEST.code,
              success: false,
            },
            { status: 400 }
          );
        }
        if (newService.ownerId !== user) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.SERVICES_CREATE_FORBIDDEN.code,
              success: false,
            },
            { status: 403 }
          );
        }

        await initAdmin();
        const firestore = getFirestore();

        const newServiceId = newService.id || getUUID("SERVICE");

        const batch = firestore.batch();
        const ownerRef = firestore.doc(`users-services/${newService.ownerId}`);
        const serviceRef = firestore.doc(`services/${newServiceId}`);

        batch.set(
          ownerRef,
          {
            [newServiceId]: {
              ...newService,
              id: newServiceId,
              serviceRef: `services/${newServiceId}`,
            },
          },
          { merge: true }
        );

        batch.set(
          serviceRef,
          {
            ...newService,
            id: newServiceId,
          },
          { merge: true }
        );

        await batch.commit();

        return NextResponse.json(
          {
            code: ResponseCodesConstants.SERVICES_CREATE_SUCCESS.code,
            data: { ...newService, id: newServiceId },
            success: true,
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.SERVICES_CREATE_ERROR.code,
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
          code: ResponseCodesConstants.SERVICES_CREATE_METHOD_NOT_ALLOWED.code,
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
