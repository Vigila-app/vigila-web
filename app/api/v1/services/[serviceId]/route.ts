import { NextResponse } from "next/server";
import {
  jsonErrorResponse,
  authenticateUser,
  getAdminClient,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { deepMerge } from "@/src/utils/common.utils";
import { getPostgresTimestamp } from "@/src/utils/date.utils";
import { RolesEnum } from "@/src/enums/roles.enums";
import { ServiceI } from "@/src/types/services.types";

const verifyServiceAccess = async (serviceId: string) => {
  const _admin = getAdminClient();
  const { data, error } = await _admin
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .single();

  if (error)
    throw jsonErrorResponse(500, {
      code: ResponseCodesConstants.SERVICES_DETAILS_ERROR.code,
      success: false,
      error,
    });

  if (!data)
    throw jsonErrorResponse(404, {
      code: ResponseCodesConstants.SERVICES_DETAILS_NOT_FOUND.code,
      success: false,
    });

  return data;
};

export async function DELETE(
  req: Request,
  context: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await context?.params;
    console.log(`API DELETE services/${serviceId}`);

    if (!serviceId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.SERVICES_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.VIGIL)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.SERVICES_DETAILS_UNAUTHORIZED.code,
        success: false,
      });

    const service = await verifyServiceAccess(serviceId);

    if (service.vigil_id !== userObject.id) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.SERVICES_DETAILS_FORBIDDEN.code,
        success: false,
      });
    }

    const _admin = getAdminClient();

    const { error } = await _admin
      .from("services")
      .delete()
      .eq("id", serviceId);

    if (error) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.SERVICES_DETAILS_SUCCESS.code,
        data: serviceId,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.SERVICES_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await context?.params;
    console.log(`API GET services/${serviceId}`);

    if (!serviceId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.SERVICES_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (!userObject?.id)
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.SERVICES_DETAILS_FORBIDDEN.code,
        success: false,
      });

    await verifyServiceAccess(serviceId);

    const _admin = getAdminClient();
    const { data: service, error } = await _admin
      .from("services")
      .select("*")
      .eq("id", serviceId)
      .single<ServiceI>();

    if (error || !service) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.SERVICES_DETAILS_SUCCESS.code,
        data: service,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.SERVICES_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ serviceId: string }> }
) {
  try {
    const updatedService = await req.json();
    const { serviceId } = await context?.params;
    console.log(`API PUT services/${serviceId}`, updatedService);

    if (!serviceId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.SERVICES_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    if (
      !updatedService?.id ||
      updatedService?.id !== serviceId ||
      updatedService?.postalCode?.length === 0 ||
      !updatedService?.unit_price
    ) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.SERVICES_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (!userObject?.id)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.SERVICES_DETAILS_UNAUTHORIZED.code,
        success: false,
      });

    const service = (await verifyServiceAccess(serviceId)) as ServiceI;

    if (service.vigil_id !== userObject.id) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.SERVICES_DETAILS_FORBIDDEN.code,
        success: false,
      });
    }

    const _admin = getAdminClient();

    // Only allow certain fields to be updated based on user role
    let allowedUpdates = {};
    if (userObject.user_metadata?.role === RolesEnum.VIGIL) {
      allowedUpdates = {
        active: updatedService.active,
        unit_price: updatedService.unit_price,
        postalCode: updatedService.postalCode,
      };
    }

    const { data, error } = await _admin
      .from("services")
      .update({
        ...deepMerge(service, allowedUpdates),
        updated_at: getPostgresTimestamp(),
      })
      .eq("id", updatedService.id)
      .select("*")
      .single<ServiceI>();

    if (error || !data) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.SERVICES_DETAILS_SUCCESS.code,
        data,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.SERVICES_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}
