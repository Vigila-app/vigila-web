import { AddressI } from "@/src/types/maps.types";
import { ApiService } from "@/src/services";
import { apiMaps } from "@/src/constants/api.constants";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";

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
            message: "Indirizzo non trovato!",
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
  autocompleteAddress: async (
    search: string,
    addresstypes = ["road", "village", "town", "suburb", "neighbourhood"]
  ): Promise<AddressI[]> =>
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
                ((addresstypes.includes(result.addresstype) &&
                  result.importance > 0.03) ||
                  result.addresstype === "place") &&
                result.address?.country_code === "it" &&
                result.address?.postcode
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
