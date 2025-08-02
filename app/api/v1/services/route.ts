import {
  authenticateUser,
  getAdminClient,
  getPagination,
  getQueryParams,
  jsonErrorResponse,
} from "@/server/api.utils.server";
import { ResponseCodesConstants } from "@/src/constants";
import { RolesEnum } from "@/src/enums/roles.enums";
import { NextRequest, NextResponse } from "next/server";
import { ServiceI } from "@/src/types/services.types";

export async function GET(req: NextRequest) {
  try {
    const { nextUrl, url } = req;

    const pagination = getPagination(nextUrl);
    const { from, to, page, itemPerPage } = pagination;
    const filters = getQueryParams(url, [
      "page",
      "pageSize",
      "vigil_id",
      "active",
    ]);
    const { orderBy = "created_at", orderDirection = "DESC" } = filters;

    console.log(`API GET services`, filters, pagination);

    const userObject = await authenticateUser(req);
    if (!userObject?.id)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.SERVICES_CREATE_UNAUTHORIZED.code,
        success: false,
      });

    if (
      userObject.user_metadata?.role === RolesEnum.CONSUMER &&
      !filters.postalCode
    ) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.SERVICES_CREATE_BAD_REQUEST.code,
        success: false,
      });
    }

    const _admin = getAdminClient();
    let db_query = _admin.from("services").select(
      `
        *,
        vigil:vigils(*)
      `,
      { count: "exact" }
    );

    if (Object.keys(filters).length) {
      Object.keys(filters).forEach((key) => {
        if (
          key !== "orderBy" &&
          key !== "orderDirection" &&
          key !== "postalCode" &&
          key !== "vigil_id"
        ) {
          db_query = db_query.eq(key, filters[key]);
        }
      });
    }

    if (filters.active === undefined) {
      db_query = db_query.eq("active", true);
    }

    if (userObject.user_metadata?.role === RolesEnum.VIGIL) {
      db_query = db_query.eq("vigil_id", userObject.id);
    } else if (
      userObject.user_metadata?.role === RolesEnum.CONSUMER &&
      filters.vigil_id
    ) {
      db_query = db_query.eq("vigil_id", filters.vigil_id);
    }

    if (userObject.user_metadata?.role === RolesEnum.CONSUMER) {
      db_query = db_query.contains("postalCode", [filters.postalCode]);
      db_query = db_query.eq("vigils.status", "active");
    }

    if (orderBy) {
      db_query = db_query.order(orderBy, {
        ascending: orderDirection === "ASC" ? true : false,
      });
    }

    if (
      from !== undefined &&
      to !== undefined &&
      from >= 0 &&
      to > from &&
      to <= 49
    ) {
      db_query = db_query.range(from, to);
    }

    const {
      data = [],
      error,
      count = 0,
    } = await db_query.returns<ServiceI[]>();

    if (error || !data) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.SERVICES_CREATE_SUCCESS.code,
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
      code: ResponseCodesConstants.SERVICES_CREATE_ERROR.code,
      success: false,
      error,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ServiceI = await req.json();
    console.log(`API POST services`, body);

    const userObject = await authenticateUser(req);
    if (!userObject?.id || userObject.user_metadata?.role !== RolesEnum.VIGIL)
      return jsonErrorResponse(401, {
        code: ResponseCodesConstants.SERVICES_CREATE_UNAUTHORIZED.code,
        success: false,
      });

    if (!(body?.name && body?.unit_price && body?.unit_type)) {
      return jsonErrorResponse(400, {
        code: ResponseCodesConstants.SERVICES_CREATE_BAD_REQUEST.code,
        success: false,
      });
    }

    const _admin = getAdminClient();

    const newService = {
      ...body,
      vigil_id: userObject.id,
    };

    const { data, error } = await _admin
      .from("services")
      .insert(newService)
      .select()
      .maybeSingle<ServiceI>();

    if (error || !data) throw error;

    return NextResponse.json(
      {
        code: ResponseCodesConstants.SERVICES_CREATE_SUCCESS.code,
        data,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return jsonErrorResponse(500, {
      code: ResponseCodesConstants.SERVICES_CREATE_ERROR.code,
      success: false,
      error,
    });
  }
}
