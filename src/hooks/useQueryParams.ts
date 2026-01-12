import { useMemo } from "react"
import { useSearchParams } from "next/navigation"

export function useQueryParams() {
  const searchParams = useSearchParams()

  const params = useMemo(() => {
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  }, [searchParams])

  return {
    params,
  }
}
