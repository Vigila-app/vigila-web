import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export function useQueryParams() {
  const searchParams = useSearchParams()
  const params = useMemo(() => {
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  }, [searchParams])
  const queryParams = useMemo(() => {
    if (!Object.keys(params).length) return ""
    let qp = []
    for (const key in params) {
      if (!Object.hasOwn(params, key)) continue
      const value = params[key]
      qp.push(`${key}=${value}`)
    }
    return `?${qp.join("&")}`
  }, [params])

  return {
    params,
    queryParams,
  }
};
