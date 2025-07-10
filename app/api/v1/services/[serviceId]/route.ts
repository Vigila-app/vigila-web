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
  context: { params: { serviceId: string } }
) {
  try {
    console.log(`API DELETE services/${context?.params?.serviceId}`);

    if (!context?.params?.serviceId) {
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

    const service = await verifyServiceAccess(context.params.serviceId);

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
      .eq("id", context.params.serviceId);

    if (error) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.SERVICES_DETAILS_SUCCESS.code,
        data: context.params.serviceId,
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
  context: { params: { serviceId: string } }
) {
  try {
    console.log(`API GET services/${context?.params?.serviceId}`);

    if (!context?.params?.serviceId) {
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

    await verifyServiceAccess(context.params.serviceId);

    const _admin = getAdminClient();
    const { data: service, error } = await _admin
      .from("services")
      .select("*")
      .eq("id", context.params.serviceId)
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
  context: { params: { serviceId: string } }
) {
  try {
    const { data: updatedService } = await req.json();
    console.log(
      `API PUT services/${context?.params?.serviceId}`,
      updatedService
    );

    if (!context?.params?.serviceId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.SERVICES_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    if (
      !updatedService?.id ||
      updatedService?.id !== context.params.serviceId
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

    const service = (await verifyServiceAccess(
      context.params.serviceId
    )) as ServiceI;

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
      // Vigils can update status and notes
      allowedUpdates = {
        status: updatedService.status,
        notes: updatedService.notes,
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
