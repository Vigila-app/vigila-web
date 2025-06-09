import { NextResponse } from "next/server";
import { initAdmin, validateAuth } from "@/server/supabaseAdmin";
import { ResponseCodesConstants } from "@/src/constants";
import { AuthService } from "@/src/services";
import { User } from "@supabase/supabase-js";
import { ErrorI } from "@/src/types/error.types";
import { NextURL } from "next/dist/server/web/next-url";

export const jsonErrorResponse = (status: number = 500, response: ErrorI) =>
  NextResponse.json(response, { status });

export const authenticateUser = async (req: Request) => {
  const { authToken, user } = AuthService.getAuthHeaders(req.headers);
  if (!user || !authToken) return null;
  return (await validateAuth(user, authToken)) as User;
};

export const getAdminClient = () => {
  const _admin = initAdmin();
  if (!_admin)
    throw jsonErrorResponse(503, {
      code: ResponseCodesConstants.CUSTOMERS_DETAILS_SERVICE_UNAVAILABLE.code,
      success: false,
    });
  return _admin;
};

export const getPagination = (
  nextUrl: NextURL,
  pageSize?: number,
  limit = 25
): { from: number; to: number; page: number; itemPerPage: number } => {
  const page = parseInt(nextUrl?.searchParams?.get("page") || "") || 1;
  const itemPerPage = Math.min(
    pageSize || parseInt(nextUrl?.searchParams?.get("pageSize") || "") || 10,
    limit
  );

  return {
    from: Math.max(0, itemPerPage * page - itemPerPage),
    to: Math.max(0, itemPerPage * page - 1),
    page,
    itemPerPage,
  };
};

export const getQueryParams = (url: string, blacklist: string[] = []) => {
  const params = new URL(url).searchParams;
  const queryObject = Object.fromEntries(params.entries());

  blacklist.forEach((key) => delete queryObject[key]);

  return queryObject;
};
