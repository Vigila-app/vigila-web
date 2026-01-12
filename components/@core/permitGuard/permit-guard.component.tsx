"use client"

import { RolesEnum, UserStatusEnum } from "@/src/enums/roles.enums"
import { Routes } from "@/src/routes"
import { useAppStore } from "@/src/store/app/app.store"
import { useUserStore } from "@/src/store/user/user.store"
import { isServer } from "@/src/utils/common.utils"
import { NavigationUtils } from "@/src/utils/navigation.utils"
import { PermitGuardUtils } from "@/src/utils/permit-guard.utils"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const PermitGuardComponent = () => {
  const router = useRouter()
  const pathname = usePathname()
  const user = useUserStore((state) => state.user)
  const [hide, setHide] = useState(true)
  const { showLoader, hideLoader } = useAppStore()
  const params = new URLSearchParams(isServer ? "" : window.location.search)

  const handleNotAuthorized = () => {
    console.error("Not authorized, redirecting..")
    router.replace(Routes.home.url)
  }

  const checkPermission = async () => {
    const route = NavigationUtils.getRouteByUrl(pathname)
    if (route) {
      const isAuthorized = await PermitGuardUtils.isAuthorized(route, user)
      if (!isAuthorized) {
        handleNotAuthorized()
      } else {
        if (params.get("redirectUserTo")) {
          router.replace(params.get("redirectUserTo") as string)
        } else {
          setHide(false)

          if (user?.user_metadata?.status === UserStatusEnum.PENDING) {
            router.replace(
              user.user_metadata?.role === RolesEnum.CONSUMER
                ? Routes.onBoard.url
                : Routes.onBoardVigil.url
            )
          }
        }
      }
    } else {
      handleNotAuthorized()
    }
  }

  useEffect(() => {
    setHide(true)
    checkPermission()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, user])

  useEffect(() => {
    if (hide) {
      showLoader()
    } else {
      hideLoader()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hide])

  if (hide) {
    return (
      <div className="fixed bg-white w-full h-full top-0 left-0 z-50 pointer-events-auto touch-none select-none cursor-not-allowed" />
    )
  }
  return null
}

export default PermitGuardComponent
