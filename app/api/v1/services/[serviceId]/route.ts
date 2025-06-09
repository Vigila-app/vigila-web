import { initAdmin, validateAuth } from "@/server/supabaseAdmin";
import { ResponseCodesConstants } from "@/src/constants";
import { AuthService } from "@/src/services";
import { ServiceI } from "@/src/types/services.types";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

const unauthorizedError = () =>
  NextResponse.json(
    {
      code: ResponseCodesConstants.SERVICES_DETAILS_UNAUTHORIZED.code,
      success: false,
    },
    { status: 401 }
  );

const requestHandler = async (
  req: Request,
  context: { params: { serviceId: ServiceI["id"] } }
) => {
  const { method } = req;
  const {
    params: { serviceId },
  } = context;

  if (!serviceId) {
    return NextResponse.json(
      {
        code: ResponseCodesConstants.SERVICES_DETAILS_BAD_REQUEST.code,
        success: false,
      },
      { status: 400 }
    );
  }

  console.log(`API ${method} services/${serviceId}`);

  const { authToken, user } = AuthService.getAuthHeaders(req.headers);

  if (!(user && authToken)) {
    return unauthorizedError();
  }

  /*if (// TODO check roles) {
    return NextResponse.json(
      {
        code: ResponseCodesConstants.SERVICES_DETAILS_FORBIDDEN.code,
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
    case "DELETE": {
      try {
        await initAdmin();
        const firestore = getFirestore();

        const serviceBE = await firestore.doc(`services/${serviceId}`).get();
        const { ownerId: userIdBE } = serviceBE.data() || {};

        if (userIdBE !== user) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.SERVICES_DETAILS_FORBIDDEN.code,
              success: false,
            },
            { status: 403 }
          );
        }

        const batch = firestore.batch();
        const ownerRef = firestore.doc(`users-services/${user}`);
        const serviceRef = firestore.doc(`services/${serviceId}`);

        batch.set(
          ownerRef,
          {
            [serviceId]: null,
          },
          { merge: true }
        );

        batch.delete(serviceRef);

        await batch.commit();

        return NextResponse.json(
          {
            code: ResponseCodesConstants.SERVICES_DETAILS_SUCCESS.code,
            data: serviceId,
            success: true,
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.SERVICES_DETAILS_ERROR.code,
            success: false,
            show: true,
            error,
          },
          { status: 500 }
        );
      }
      break;
    }
    case "GET": {
      try {
        await initAdmin();
        const firestore = getFirestore();

        const response = await firestore.doc(`services/${serviceId}`).get();
        if (response) {
          const service = response.data();
          if (service) {
            if (service?.ownerId !== user) {
              return NextResponse.json(
                {
                  code: ResponseCodesConstants.SERVICES_DETAILS_FORBIDDEN.code,
                  success: false,
                },
                { status: 403 }
              );
            }
            return NextResponse.json(
              {
                code: ResponseCodesConstants.SERVICES_DETAILS_SUCCESS.code,
                data: response.data(),
                success: true,
              },
              { status: 200 }
            );
          } else {
            return NextResponse.json(
              {
                code: ResponseCodesConstants.SERVICES_DETAILS_NOT_FOUND.code,
                success: false,
              },
              { status: 404 }
            );
          }
        } else {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.SERVICES_DETAILS_ERROR.code,
              success: false,
              show: true,
            },
            { status: 500 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.SERVICES_DETAILS_ERROR.code,
            success: false,
            show: true,
            error,
          },
          { status: 500 }
        );
      }
      break;
    }
    case "PUT": {
      try {
        const newService: ServiceI = await req.json();

        if (
          !(
            newService.id &&
            newService.ownerId &&
            newService.name &&
            newService.price
          ) ||
          serviceId !== newService.id
        ) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.SERVICES_DETAILS_BAD_REQUEST.code,
              success: false,
            },
            { status: 400 }
          );
        }

        await initAdmin();
        const firestore = getFirestore();

        const serviceBE = await firestore.doc(`services/${serviceId}`).get();
        const { ownerId: userIdBE } = serviceBE.data() || {};

        if (userIdBE !== user) {
          return NextResponse.json(
            {
              code: ResponseCodesConstants.SERVICES_DETAILS_FORBIDDEN.code,
              success: false,
            },
            { status: 403 }
          );
        }

        const batch = firestore.batch();
        const ownerRef = firestore.doc(`users-services/${newService.ownerId}`);
        const serviceRef = firestore.doc(`services/${serviceId}`);

        batch.set(
          ownerRef,
          {
            [serviceId]: newService,
          },
          { merge: true }
        );

        batch.set(serviceRef, newService, { merge: true });

        await batch.commit();

        return NextResponse.json(
          {
            code: ResponseCodesConstants.SERVICES_DETAILS_SUCCESS.code,
            data: newService,
            success: true,
          },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          {
            code: ResponseCodesConstants.SERVICES_DETAILS_ERROR.code,
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
          code: ResponseCodesConstants.SERVICES_DETAILS_METHOD_NOT_ALLOWED.code,
          success: false,
        },
        { status: 405 }
      );
      break;
    }
  }
};

export async function DELETE(
  req: Request,
  context: { params: { serviceId: ServiceI["id"] } }
) {
  return requestHandler(req, context);
}

export async function GET(
  req: Request,
  context: { params: { serviceId: ServiceI["id"] } }
) {
  return requestHandler(req, context);
}

export async function PUT(
  req: Request,
  context: { params: { serviceId: ServiceI["id"] } }
) {
  return requestHandler(req, context);
}
