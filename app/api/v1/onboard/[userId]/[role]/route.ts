import {
  jsonErrorResponse,
  authenticateUser,
  getAdminClient,
} from "@/server/api.utils.server";
import { EmailService } from "@/server/email.service";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum, UserStatusEnum } from "@/src/enums/roles.enums";
import { UserDetailsType } from "@/src/types/user.types";
import { deepMerge } from "@/src/utils/common.utils";
import { getPostgresTimestamp } from "@/src/utils/date.utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ userId: string; role: string }> },
) {
  try {
    const { userId, role } = await context?.params;
    const onBoardUser = await req.json();

    if (!userId || !role || !onBoardUser) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.USER_DETAILS_BAD_REQUEST.code,
        success: false,
      });
    }

    const originalUser = await authenticateUser(req);
    const userRole = originalUser?.user_metadata?.role?.toUpperCase();
    const userStatus = originalUser?.user_metadata?.status;

    if (
      !originalUser?.id ||
      originalUser.id !== userId ||
      ![RolesEnum.CONSUMER, RolesEnum.VIGIL].includes(userRole)
    ) {
      return jsonErrorResponse(403, {
        code: ResponseCodesConstants.USER_DETAILS_FORBIDDEN.code,
        success: false,
      });
    }

    const table =
      role.toUpperCase() === RolesEnum.CONSUMER ? "consumers" : "vigils";
    const _admin = getAdminClient();

    if (role.toUpperCase() === RolesEnum.VIGIL) {
      const anagraficaKeys = new Set([
        "birthday",
        "gender",
        "addresses",
        "cap",
        "bio",
        "propic",
      ]);
      const nonSavableKeys = new Set(["zones", "time_committment", "type"]);

      const vigilProfileData = Object.fromEntries(
        Object.entries(onBoardUser).filter(([key]) => anagraficaKeys.has(key)),
      );

      const vigilExtraData = Object.fromEntries(
        Object.entries(onBoardUser).filter(
          ([key]) => !anagraficaKeys.has(key) && !nonSavableKeys.has(key),
        ),
      );
      console.log(vigilExtraData);
      const { data, error } = await _admin
        .from("vigils")
        .update({
          ...vigilProfileData,
          status: UserStatusEnum.ACTIVE,
          updated_at: getPostgresTimestamp(),
        })
        .eq("id", userId)
        .select()
        .maybeSingle();
      if (error || !data)
        throw error || new Error("No data returned from update");

      if (Object.keys(vigilExtraData).length > 0) {
        const { error: vigilDataError } = await _admin
          .from("vigils_data")
          .upsert(
            {
              vigil_id: userId,
              ...vigilExtraData,
              updated_at: getPostgresTimestamp(),
            },
            { onConflict: "id" },
          )
          .select()
          .maybeSingle();

        if (vigilDataError) throw vigilDataError;
      }

      if (userStatus === UserStatusEnum.PENDING) {
        const { error: authError } = await _admin.auth.admin.updateUserById(
          userId,
          {
            user_metadata: deepMerge(originalUser.user_metadata, {
              status: UserStatusEnum.ACTIVE,
            }),
          },
        );
        if (authError) throw authError;
      }

      if (originalUser.email) {
        await EmailService.sendProfileActiveEmail(
          {
            to: originalUser.email,
            subject:
              userRole === RolesEnum.CONSUMER
                ? "Il tuo profilo Vigila è pronto 🥳"
                : "Benvenuto/a in Vigila 🧡",
          },
          originalUser as UserDetailsType,
        );
      }

      return NextResponse.json({
        code: ResponseCodesConstants.USER_DETAILS_SUCCESS.code,
        data,
        success: true,
      });
    }
    const ConsumerAnagraficaKeys = new Set([
      "relationship",
      "lovedOneName",
      // "gender",
      "birthday",
      "address",
      "cap",
      "information",
    ]);

    const consumerProfileData = Object.fromEntries(
      Object.entries(onBoardUser).filter(([key]) =>
        ConsumerAnagraficaKeys.has(key),
      ),
    );
const consumerExtraData = Object.fromEntries(
      Object.entries(onBoardUser).filter(
        ([key]) => !ConsumerAnagraficaKeys.has(key),
      ),
    );
    console.log("EXTRA DATA ",consumerExtraData);
    const { data, error } = await _admin
      .from("consumers")
      .update({
        ...consumerProfileData,
        status: UserStatusEnum.ACTIVE,
        updated_at: getPostgresTimestamp(),
      })
      .eq("id", userId)
      .select()
      .maybeSingle();
    if (error || !data)
      throw error || new Error("No data returned from update");

    if( Object.keys(consumerExtraData).length > 0) {
      const { error: consumerDataError } = await _admin
        .from("consumers_data")
        .upsert(
          {
            consumer_id: userId,
            ...consumerExtraData,
            updated_at: getPostgresTimestamp(),
          },
          { onConflict: "id" },
        )
        .select()
        .maybeSingle();

      if (consumerDataError) throw consumerDataError;
    }

    if (userStatus === UserStatusEnum.PENDING) {
      const { error: authError } = await _admin.auth.admin.updateUserById(
        userId,
        {
          user_metadata: deepMerge(originalUser.user_metadata, {
            status: UserStatusEnum.ACTIVE,
          }),
        },
      );
      if (authError) throw authError;
    }

    if (originalUser.email) {
      await EmailService.sendProfileActiveEmail(
        {
          to: originalUser.email,
          subject:
            userRole === RolesEnum.CONSUMER
              ? "Il tuo profilo Vigila è pronto 🥳"
              : "Benvenuto/a in Vigila 🧡",
        },
        originalUser as UserDetailsType,
      );
    }

    return NextResponse.json({
      code: ResponseCodesConstants.USER_DETAILS_SUCCESS.code,
      data,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.USER_DETAILS_ERROR.code,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
