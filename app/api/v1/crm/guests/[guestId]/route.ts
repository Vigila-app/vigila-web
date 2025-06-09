// api/route.ts
import { NextResponse } from "next/server";
import {
  jsonErrorResponse,
  authenticateUser,
  getAdminClient,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { deepMerge } from "@/src/utils/common.utils";
import { getPostgresTimestamp } from "@/src/utils/date.utils";
import { GuestI } from "@/src/types/crm.types";
import { RolesEnum } from "@/src/enums/roles.enums";

const verifyGuestAccess = async (guestId: string, userId: string) => {
  const _admin = getAdminClient();
  const { data, error } = await _admin
    .from("guests")
    .select()
    .eq("id", guestId)
    .maybeSingle();
  if (error)
    throw jsonErrorResponse(500, {
      code: ResponseCodesConstants.CUSTOMERS_DETAILS_ERROR.code,
      success: false,
      error,
    });
  if (!data || data.host_id !== userId)
    throw jsonErrorResponse(403, {
      code: ResponseCodesConstants.CUSTOMERS_DETAILS_FORBIDDEN.code,
      success: false,
    });
  return data;
};

export async function DELETE(
  req: Request,
  context: { params: { guestId: string } }
) {
  try {
    console.log(`API DELETE crm/guests/${context?.params?.guestId}`);

    if (!context?.params?.guestId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.CUSTOMERS_CREATE_BAD_REQUEST.code,
        success: false,
      });
    }
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.HOST)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.CUSTOMERS_DETAILS_UNAUTHORIZED.code,
        success: false,
      });

    await verifyGuestAccess(context.params.guestId, userObject.id);
    const _admin = getAdminClient();

    const { error } = await _admin
      .from("guests")
      .delete()
      .eq("id", context.params.guestId);
    if (error) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.CUSTOMERS_DETAILS_SUCCESS.code,
        data: context.params.guestId,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.CUSTOMERS_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function GET(
  req: Request,
  context: { params: { guestId: string } }
) {
  try {
    console.log(`API GET crm/guests/${context?.params?.guestId}`);

    if (!context?.params?.guestId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.CUSTOMERS_CREATE_BAD_REQUEST.code,
        success: false,
      });
    }
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.HOST)
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.CUSTOMERS_CREATE_FORBIDDEN.code,
        success: false,
      });

    const guest = await verifyGuestAccess(
      context.params.guestId,
      userObject.id
    );
    return NextResponse.json(
      {
        code: ResponseCodesConstants.CUSTOMERS_DETAILS_SUCCESS.code,
        data: guest,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.CUSTOMERS_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function PUT(
  req: Request,
  context: { params: { guestId: string } }
) {
  try {
    const updatedGuest: GuestI = await req.json();
    console.log(`API PUT crm/guests/${context?.params?.guestId}`, updatedGuest);

    if (!context?.params?.guestId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.CUSTOMERS_CREATE_BAD_REQUEST.code,
        success: false,
      });
    }
    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.HOST)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.CUSTOMERS_DETAILS_UNAUTHORIZED.code,
        success: false,
      });

    if (
      !updatedGuest?.id ||
      updatedGuest?.host_id !== userObject.id ||
      updatedGuest?.id !== context.params.guestId
    ) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.CUSTOMERS_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const guest = (await verifyGuestAccess(
      context.params.guestId,
      userObject.id
    )) as GuestI;
    const _admin = getAdminClient();

    const { data, error } = await _admin
      .from("guests")
      .update({
        ...deepMerge(guest, updatedGuest),
        created_at: guest.created_at,
        updated_at: getPostgresTimestamp(),
        host_id: userObject.id,
      })
      .eq("id", updatedGuest.id)
      .select()
      .maybeSingle();

    if (error || !data) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.CUSTOMERS_DETAILS_SUCCESS.code,
        data,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.CUSTOMERS_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}
