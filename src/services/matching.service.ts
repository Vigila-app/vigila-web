import { ApiService } from "@/src/services/api.service";
import { apiMatching } from "@/src/constants/api.constants";
import {
  ServiceCatalogTypeEnum,
  ServiceCatalogTypeLabels,
} from "@/src/enums/services.enums";

/**
 * Build the MatchingRequestI payload expected by the server from the
 * answers object produced by the Availability flow.
 */
export function buildMatchingRequestFromAnswers(answers: Record<string, any>) {
  if (!answers)
    throw new Error("No answers provided to build matching request");

  const raw = answers;

  // selectedDays: prefer availabilityRules weekdays, fallback to services keys or single booking day
  const availabilityRules = Array.isArray(raw.availabilityRules)
    ? raw.availabilityRules
    : [];
  let selectedDays: number[] = [];
  if (availabilityRules.length > 0) {
    selectedDays = Array.from(
      new Set(availabilityRules.map((r: any) => Number(r.weekday))),
    );
  } else if (raw.services && typeof raw.services === "object") {
    selectedDays = Array.from(
      new Set(Object.keys(raw.services).map((k) => Number(k))),
    );
  } else if (raw["start-date"] || raw.startDate) {
    const sd = raw["start-date"] || raw.startDate;
    const d = new Date(sd);
    if (!isNaN(d.getTime())) selectedDays = [d.getUTCDay()];
  }

  // dates: startDate from answers, endDate either explicit or 4 weeks later for recurrence
  const startRaw =
    raw["start-date"] ||
    raw.startDate ||
    (availabilityRules[0] && availabilityRules[0].valid_from);
  const startDate = startRaw ? new Date(String(startRaw)) : null;
  if (!startDate) throw new Error("startDate not available in answers");
  const startIso = startDate.toISOString().slice(0, 10);
  let endIso = startIso;
  if (raw["end-date"] || raw.endDate) {
    endIso = (raw["end-date"] || raw.endDate).toString().slice(0, 10);
  } else {
    // default recurrence: 4 weeks
    const d = new Date(startDate);
    d.setUTCDate(d.getUTCDate() + 28);
    endIso = d.toISOString().slice(0, 10);
  }

  // build schedule: pick first availability rule per weekday and use first selected service for that day
  const schedule: Record<string, any> = {};

  // invert label map to resolve human labels -> enum value
  const labelToEnum = Object.keys(ServiceCatalogTypeLabels).reduce(
    (acc: Record<string, string>, key) => {
      const k = key as keyof typeof ServiceCatalogTypeLabels;
      const label = (ServiceCatalogTypeLabels as any)[k] as string;
      acc[label.toLowerCase()] = (ServiceCatalogTypeEnum as any)[k];
      return acc;
    },
    {},
  );

  const servicesByDay = raw.services || {};

  selectedDays.forEach((day) => {
    const weekdayKey = String(day);
    // time: prefer availabilityRules first
    const rule = availabilityRules.find(
      (r: any) => Number(r.weekday) === Number(day),
    );
    let start = rule ? rule.start_time?.slice(0, 5) : undefined;
    let end = rule ? rule.end_time?.slice(0, 5) : undefined;

    // service: try servicesByDay[day].services[0] and map to enum
    let serviceName: string | undefined;
    try {
      const svcArr = servicesByDay?.[weekdayKey]?.services;
      if (Array.isArray(svcArr) && svcArr.length > 0)
        serviceName = String(svcArr[0]);
    } catch (e) {
      /* ignore */
    }

    let serviceEnum: string | undefined;
    if (serviceName) {
      const low = serviceName.toLowerCase();
      // exact label match
      if (labelToEnum[low]) serviceEnum = labelToEnum[low];
      else {
        // fuzzy: find label that is substring of serviceName or viceversa
        for (const labelLower of Object.keys(labelToEnum)) {
          if (low.includes(labelLower) || labelLower.includes(low)) {
            serviceEnum = labelToEnum[labelLower];
            break;
          }
        }
      }
    }

    // fallback if any missing
    if (!start) start = "09:00";
    if (!end) end = "13:00";
    if (!serviceEnum) serviceEnum = ServiceCatalogTypeEnum.LIGHT_ASSISTANCE;

    schedule[weekdayKey] = {
      start,
      end,
      service: serviceEnum,
    };
  });

  // address: normalize common shapes and unwrap nested `address.address` if present
  let address: Record<string, any> = {};
  if (raw?.address) {
    if (
      typeof raw.address === "object" &&
      raw.address.address &&
      typeof raw.address.address === "object"
    ) {
      address = raw.address.address;
    } else if (typeof raw.address === "object") {
      address = raw.address;
    }
  } else if (Array.isArray(raw.addresses) && raw.addresses[0]?.address) {
    address = raw.addresses[0].address;
  } else if (
    raw?.addresses &&
    typeof raw.addresses === "object" &&
    raw.addresses.address
  ) {
    address = raw.addresses.address;
  }

  return {
    selectedDays,
    schedule,
    dates: { startDate: startIso, endDate: endIso },
    address,
  };
}

export const MatchingService = {
  match: (payload?: any): Promise<any> =>
    new Promise(async (res, rej) => {
      try {
        // payload may be { role, data } where data is the answers object
        const answers = payload?.data ?? payload;
        const requestBody = buildMatchingRequestFromAnswers(answers);
        const response = await ApiService.post(
          apiMatching.MATCH(),
          requestBody,
        );
        res(response);
      } catch (error) {
        console.error("Matching API error", error);
        rej(error);
      }
    }),
};

export default MatchingService;
