import {
  authenticateUser,
  getAdminClient,
  getPagination,
  getQueryParams,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { GuestI } from "@/src/types/crm.types";
import { CrmUtils } from "@/src/utils/crm.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { nextUrl, url } = req;

    const pagination = getPagination(nextUrl);
    const { from, to, page, itemPerPage } = pagination;
    const filters = getQueryParams(url, ["page", "pageSize"]);
    const { orderBy = "updated_at", orderDirection = "DESC" } = filters;

    console.log(`API GET crm/guests`, filters, pagination);

    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.HOST)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.CUSTOMERS_CREATE_UNAUTHORIZED.code,
        success: false,
      });

    const _admin = getAdminClient();
    let db_query = _admin
      .from("guests")
      .select("*", { count: "exact" })
      .eq("host_id", userObject.id);

    if (Object.keys(filters).length) {
      Object.keys(filters).forEach((key) => {
        if (key !== "orderBy" && key !== "orderDirection") {
          db_query = db_query.eq(key, filters[key]);
        }
      });
    }

    if (orderBy) {
      db_query = db_query.order(orderBy, {
        ascending: orderDirection === "ASC" ? true : false,
      });
    }

    if (from !== undefined && to !== undefined) {
      db_query = db_query.range(from, to);
    }

    const { data = [], error, count = 0 } = await db_query.returns<GuestI[]>();

    if (error || !data) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.CUSTOMERS_CREATE_SUCCESS.code,
        data,
        success: true,
        pagination: {
          page,
          pages: Math.ceil((count || 0) / itemPerPage),
          itemPerPage,
          count,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.CUSTOMERS_CREATE_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: GuestI = await req.json();
    console.log(`API POST crm/guests`, body);

    const newGuest = await CrmUtils.createNewGuest(body);
    if (!(newGuest?.host_id && newGuest?.name && newGuest.surname)) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.CUSTOMERS_CREATE_BAD_REQUEST.code,
        success: false,
      });
    }

    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.HOST)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.CUSTOMERS_CREATE_UNAUTHORIZED.code,
        success: false,
      });

    if (newGuest?.host_id !== userObject.id) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.CUSTOMERS_CREATE_FORBIDDEN.code,
        success: false,
      });
    }

    const _admin = getAdminClient();
    const { data, error } = await _admin
      .from("guests")
      .insert({ ...newGuest, host_id: userObject.id })
      .select()
      .maybeSingle<GuestI>();

    if (error || !data) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.CUSTOMERS_CREATE_SUCCESS.code,
        data,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.CUSTOMERS_CREATE_ERROR.code,
      success: false,
      error,
    });
  }
}
