import { AddressI } from "@/src/types/maps.types";
import { ApiService } from "@/src/services";
import { apiMaps } from "@/src/constants/api.constants";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";

export const MapsService = {
  validateAddress: async (address: AddressI) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = (await ApiService.post(
          apiMaps.VALIDATE(),
          address
        )) as { data: any[] };
        if (response?.data?.length) {
          // TODO manage length > 1
          resolve(response.data[0]);
        } else {
          useAppStore.getState().showToast({
            message: "Address not found!",
            type: ToastStatusEnum.ERROR,
          });
          reject(
            `MapsService validateAddress error: impossible to find the address provided. ${JSON.stringify(
              address
            )}`
          );
        }
      } catch (error) {
        console.error("MapsService validateAddress error", error);
        reject(error);
      }
    }),
};
