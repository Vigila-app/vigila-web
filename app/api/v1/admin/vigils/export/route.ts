import { NextRequest, NextResponse } from "next/server";
import { getAdminClient, jsonErrorResponse } from "@/server/api.utils.server";
import { RolesEnum } from "@/src/enums/roles.enums";
import { User } from "@supabase/supabase-js";

type VigilProfile = {
  id: string;
  name?: string | null;
  surname?: string | null;
  displayName?: string | null;
  phone?: string | null;
};

type ExportRow = {
  id: string;
  name: string;
  surname: string;
  displayName: string;
  email: string;
  phone: string;
};

const CSV_HEADERS: (keyof ExportRow)[] = [
  "id",
  "name",
  "surname",
  "displayName",
  "email",
  "phone",
];

const getMetadataString = (
  metadata: Record<string, unknown> | undefined,
  keys: string[],
): string => {
  if (!metadata) return "";

  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
};

const isLocalRequest = (req: NextRequest) => {
  const host = req.headers.get("host") || "";
  const forwardedFor = req.headers.get("x-forwarded-for") || "";
  const realIp = req.headers.get("x-real-ip") || "";

  return (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    realIp === "127.0.0.1" ||
    realIp === "::1" ||
    forwardedFor.includes("127.0.0.1") ||
    forwardedFor.includes("::1")
  );
};

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

const escapeCsv = (value: string) => {
  if (!value) return "";
  const safeValue = value.replace(/"/g, '""');
  return /[",\n]/.test(safeValue) ? `"${safeValue}"` : safeValue;
};

const toCsv = (rows: ExportRow[]) => {
  const header = CSV_HEADERS.join(",");
  const body = rows.map((row) =>
    CSV_HEADERS.map((key) => escapeCsv(row[key])).join(","),
  );
  return [header, ...body].join("\n");
};

const listAllVigilUsers = async (): Promise<User[]> => {
  const admin = getAdminClient();
  const perPage = 200;
  const users: User[] = [];
  let page = 1;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const pageUsers = data.users || [];
    users.push(
      ...pageUsers.filter(
        (user) =>
          typeof user.user_metadata?.role === "string" &&
          user.user_metadata.role.toUpperCase() === RolesEnum.VIGIL,
      ),
    );

    if (pageUsers.length < perPage) break;
    page += 1;
  }

  return users;
};

const getVigilProfilesByIds = async (ids: string[]) => {
  const admin = getAdminClient();
  const profilesById = new Map<string, VigilProfile>();

  for (const idsChunk of chunk(ids, 200)) {
    const { data, error } = await admin
      .from("vigils")
      .select("id,displayName,phone")
      .in("id", idsChunk);

    if (error) throw error;

    for (const profile of data || []) {
      profilesById.set(profile.id, profile);
    }
  }

  return profilesById;
};

export async function GET(req: NextRequest) {
  try {
    if (process.env.NODE_ENV !== "development" || !isLocalRequest(req)) {
      return jsonErrorResponse(403, {
        code: "ADMIN_VIGILS_EXPORT_FORBIDDEN",
        success: false,
        message:
          "Questa API temporanea è disponibile solo in locale (development)",
      });
    }

    const format =
      req.nextUrl.searchParams.get("format")?.toLowerCase() || "csv";

    const vigilUsers = await listAllVigilUsers();
    const vigilIds = vigilUsers.map((user) => user.id);
    const profilesById = await getVigilProfilesByIds(vigilIds);

    const rows: ExportRow[] = vigilUsers
      .map((user) => {
        const metadata = user.user_metadata as
          | Record<string, unknown>
          | undefined;
        const profile = profilesById.get(user.id);

        const name =
          profile?.name?.trim() ||
          getMetadataString(metadata, [
            "name",
            "firstName",
            "first_name",
            "given_name",
          ]);

        const surname =
          profile?.surname?.trim() ||
          getMetadataString(metadata, [
            "surname",
            "lastName",
            "last_name",
            "family_name",
          ]);

        const displayName =
          profile?.displayName?.trim() ||
          getMetadataString(metadata, [
            "displayName",
            "display_name",
            "fullName",
          ]) ||
          `${name} ${surname}`.trim();

        const phone =
          profile?.phone?.trim() ||
          getMetadataString(metadata, [
            "phone",
            "phoneNumber",
            "phone_number",
            "mobile",
          ]);

        return {
          id: user.id,
          name,
          surname,
          displayName,
          email: user.email || "",
          phone,
        };
      })
      .sort((a, b) =>
        (a.displayName || a.email).localeCompare(
          b.displayName || b.email,
          "it",
          {
            sensitivity: "base",
          },
        ),
      );

    if (format === "json") {
      return NextResponse.json({
        code: "ADMIN_VIGILS_EXPORT_SUCCESS",
        success: true,
        count: rows.length,
        data: rows,
      });
    }

    const csvData = toCsv(rows);
    const fileDate = new Date().toISOString().slice(0, 10);

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="vigils-export-${fileDate}.csv"`,
      },
    });
  } catch (error) {
    console.error("Admin vigils export error:", error);
    return jsonErrorResponse(500, {
      code: "ADMIN_VIGILS_EXPORT_ERROR",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
