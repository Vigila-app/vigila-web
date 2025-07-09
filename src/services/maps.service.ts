import { AddressI } from "@/src/types/maps.types";
import { ApiService } from "@/src/services";
import { apiMaps } from "@/src/constants/api.constants";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { LatLngExpression } from "leaflet";

export const MapsService = {
  validateAddress: async (address: AddressI): Promise<AddressI | null> =>
    new Promise(async (resolve, reject) => {
      try {
        const response = (await ApiService.post(apiMaps.VALIDATE(), {
          ...address,
          addressdetails: 1,
        })) as { data: any[] };
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
  autocompleteAddress: async (search: string): Promise<AddressI[]> =>
    new Promise(async (resolve, reject) => {
      try {
        const response = (await ApiService.post(apiMaps.VALIDATE(), {
          q: search,
          layer: "address",
          addressdetails: 1,
        })) as { data: any[] };
        if (response?.data?.length) {
          const results = response.data
            .filter(
              (result) =>
                result?.lat &&
                result?.lon &&
                (result.addresstype === "road" ||
                  result.addresstype === "village" ||
                  result.addresstype === "town" ||
                  result.addresstype === "suburb") &&
                result.importance > 0.03 &&
                result.address?.country_code === "it"
            )
            .sort((a, b) => {
              if (a.importance > b.importance) {
                return -1;
              } else if (a.importance < b.importance) {
                return 1;
              } else {
                return 0;
              }
            });
          resolve(results);
        } else {
          reject(
            `MapsService autocompleteAddress error: impossible to find results for search "${search}"`
          );
        }
      } catch (error) {
        console.error("MapsService autocompleteAddress error", error);
        reject(error);
      }
    }),
};
