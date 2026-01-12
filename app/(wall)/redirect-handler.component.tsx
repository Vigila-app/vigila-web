"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/src/store/user/user.store"
import { Routes } from "@/src/routes"
import { RolesEnum, UserStatusEnum } from "@/src/enums/roles.enums"
import { isServer } from "@/src/utils/common.utils"

export default function RedirectHandler() {
  const router = useRouter()
  const { user } = useUserStore()

  const params = new URLSearchParams(isServer ? "" : window.location.search)

  const queryParams = params.toString()?.length ? `?${params.toString()}` : ""

  useEffect(() => {
    if (user?.user_metadata?.role === RolesEnum.CONSUMER) {
      router.replace(`${Routes.homeConsumer.url}${queryParams}`)
    } else if (user?.user_metadata?.role === RolesEnum.VIGIL) {
      switch (user?.user_metadata?.status) {
        case UserStatusEnum.ACTIVE:
        default:
          router.replace(`${Routes.profileVigil.url}${queryParams}`)
          break
        case UserStatusEnum.PENDING:
          router.replace(`${Routes.onBoardVigil.url}${queryParams}`)
          break
      }
    }
  }, [user, router, queryParams])

  return null
}
