import { NextResponse } from "next/server";
import {
  jsonErrorResponse,
  authenticateUser,
  getAdminClient,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { SupabaseConstants } from "@/src/constants/supabase.constants";
import { HeadersEnum } from "@/src/enums/headers.enums";
import { deepMerge } from "@/src/utils/common.utils";
import { getPostgresTimestamp } from "@/src/utils/date.utils";

const verifyUserAccess = async (userId: string, role: RolesEnum) => {
  if (
    !userId ||
    (role?.toUpperCase() !== RolesEnum.CONSUMER &&
      role?.toUpperCase() !== RolesEnum.VIGIL)
  ) {
    throw jsonErrorResponse(400, {
      code: ResponseCodesConstants.USER_DETAILS_BAD_REQUEST.code,
      success: false,
    });
  }
  const _admin = getAdminClient();
  const { data, error } = await _admin
    .from(
      role.toUpperCase() === RolesEnum.CONSUMER
        ? "consumers"
        : role.toUpperCase() === RolesEnum.VIGIL
        ? "vigils"
        : ""
    )
    .select()
    .eq("id", userId)
    .maybeSingle();
  if (error)
    throw jsonErrorResponse(500, {
      code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
      success: false,
      error,
    });
  if (!data || data.id !== userId)
    throw jsonErrorResponse(403, {
      code: ResponseCodesConstants.USER_DETAILS_FORBIDDEN.code,
      success: false,
    });
  return data;
};

export async function DELETE(
  req: Request,
  context: { params: { userId: string; role: RolesEnum } }
) {
  try {
    const { userId, role } = await context?.params;
    console.log(`API DELETE user/${role}/${userId}`);

    if (!userId || !role) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.USER_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }
    const userObject = await authenticateUser(req);
    if (
      !userObject?.id ||
      userId !== userObject?.id ||
      (userObject.user_metadata?.role?.toUpperCase() !== RolesEnum.CONSUMER &&
        userObject.user_metadata?.role?.toUpperCase() !== RolesEnum.VIGIL)
    )
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.USER_DETAILS_UNAUTHORIZED.code,
        success: false,
      });

    await verifyUserAccess(userId, role);
    const _admin = getAdminClient();

    const { error: authError } = await _admin.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    const { error } = await _admin
      .from(
        role.toUpperCase() === RolesEnum.CONSUMER
          ? "consumers"
          : role?.toUpperCase() === RolesEnum.VIGIL
          ? "vigils"
          : ""
      )
      .delete()
      .eq("id", userId);
    if (error) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.USER_DETAILS_SUCCESS.code,
        data: context.params.userId,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function GET(
  req: Request,
  context: { params: { userId: string; role: RolesEnum } }
) {
  try {
    const { userId, role } = await context?.params;
    console.log(`API GET user/${role}/${userId}`);

    if (!userId || !role) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.USER_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (
      !userObject?.id ||
      (userObject.user_metadata?.role?.toUpperCase() !== RolesEnum.CONSUMER &&
        userObject.user_metadata?.role?.toUpperCase() !== RolesEnum.VIGIL)
    )
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.USER_DETAILS_FORBIDDEN.code,
        success: false,
      });

    await verifyUserAccess(userId, role);

    const response = await fetch(
      `${SupabaseConstants.authDomain}/auth/v1/user`,
      {
        method: "GET",
        headers: {
          Apikey: SupabaseConstants.apiKey,
          Authorization: `Bearer ${req.headers?.get(HeadersEnum.AUTH_TOKEN)}`,
        },
      }
    );
    const data = await response.json();
    if (data) {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.USER_DETAILS_SUCCESS.code,
          data,
          success: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
          success: false,
          show: true,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function PUT(
  req: Request,
  context: { params: { userId: string; role: RolesEnum } }
) {
  try {
    const { userId, role } = await context?.params;

    const { data: updatedUser } = await req.json();
    console.log(`API PUT user/${role}/${userId}`, updatedUser);

    if (!userId || !role || !updatedUser) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.USER_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (
      !userObject?.id ||
      userId !== userObject?.id ||
      (userObject.user_metadata?.role?.toUpperCase() !== RolesEnum.CONSUMER &&
        userObject.user_metadata?.role?.toUpperCase() !== RolesEnum.VIGIL)
    )
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.USER_DETAILS_FORBIDDEN.code,
        success: false,
      });

    const originalUser = await verifyUserAccess(userId, role);

    if (originalUser?.id !== userId) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.USER_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const _admin = getAdminClient();

    const { error: authError } = await _admin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: deepMerge(originalUser.user_metadata, updatedUser),
      }
    );
    if (authError) throw authError;

    const { data, error } = await _admin
      .from(
        role.toUpperCase() === RolesEnum.CONSUMER
          ? "consumers"
          : role.toUpperCase() === RolesEnum.VIGIL
          ? "vigils"
          : ""
      )
      .update({
        ...deepMerge(originalUser, updatedUser),
        name: undefined,
        surname: undefined,
        created_at: originalUser.created_at,
        updated_at: getPostgresTimestamp(),
        id: userObject.id,
      })
      .eq("id", originalUser.id)
      .select()
      .maybeSingle();

    if (error || !data) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.USER_DETAILS_SUCCESS.code,
        data,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
      success: false,
      error,
    });
  }
}
