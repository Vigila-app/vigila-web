import { EnvsEnum } from "@/src/enums/envs.enums"

export const isMocked = process.env.NEXT_PUBLIC_API_ENV === EnvsEnum.MOCKS
export const isDev = process.env.NODE_ENV === EnvsEnum.DEV
export const isReleased = process.env.NODE_ENV === EnvsEnum.PROD