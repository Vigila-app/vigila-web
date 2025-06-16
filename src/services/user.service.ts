import { AuthInstance } from "@/src/services/auth.service";
import {
  UserDetailsType,
  UserDevicesType,
  UserTermsType,
  UserType,
} from "@/src/types/user.types";
import { useUserStore } from "@/src/store/user/user.store";
import { ApiService, RecaptchaService } from "@/src/services";
import { RecaptchaActionEnum } from "@/src/enums/common.enums";
import { apiUser } from "@/src/constants/api.constants";
import { AppConstants } from "@/src/constants";
import { Routes } from "@/src/routes";
import { RolesEnum } from "../enums/roles.enums";

export const UserService = {
  getUser: async (force = false, id = "", role = "") =>
    new Promise<UserType | null>(async (resolve, reject) => {
      try {
        //if (isServer) resolve(AuthInstance?.currentUser);

        if (force) {
          if (id && role) {
            const { data } = (await ApiService.get(
              apiUser.DETAILS(id as string, role as RolesEnum)
            )) as { data: UserType };
            resolve(data);
          } else {
            return await AuthInstance.auth.getUser();
          }
        }

        const { user } = useUserStore.getState();

        resolve(user);
      } catch (error) {
        console.error("UserService getUser error", error);
        reject(error);
      }
    }),
  getUserDetails: async () =>
    new Promise<UserDetailsType>(async (resolve, reject) => {
      try {
        const user = await UserService.getUser();
        if (user?.id && user?.user_metadata?.role) {
          const { data: response } = (await ApiService.get(
            apiUser.DETAILS(user?.id, user?.user_metadata?.role as RolesEnum)
          )) as { data: UserDetailsType };
          resolve(response);
        } else {
          reject();
        }
      } catch (error) {
        console.error("UserService getUserDetails error", error);
        reject(error);
      }
    }),
  updateEmail: async (newEmail: string) =>
    new Promise(async (resolve, reject) => {
      if (newEmail) {
        const { data, error } = await AuthInstance.auth.updateUser({
          email: newEmail,
        });

        if (error) {
          console.error("UserService updateEmail error", error);
          reject(error);
        }
        resolve(data);
      } else {
        reject();
      }
    }),
  updatePassword: async (newPassword: string) =>
    new Promise(async (resolve, reject) => {
      if (newPassword) {
        const { data, error } = await AuthInstance.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          console.error("UserService updatePassword error", error);
          reject(error);
        }
        resolve(data);
      } else {
        reject();
      }
    }),
  updateUser: async (
    userData: {
      displayName?: string;
      photoURL?: string;
    },
    userDetails?: UserDetailsType
  ) =>
    new Promise<{
      data?: { displayName?: string; photoURL?: string };
      details?: UserDetailsType;
    }>(async (resolve, reject) => {
      try {
        const user = await UserService.getUser();
        if (user?.id && user?.user_metadata?.role) {
          const { data: response } = (await ApiService.put(
            apiUser.DETAILS(user.id, user.user_metadata?.role as RolesEnum),
            {
              data: { ...userData, ...userDetails },
            }
          )) as any;
          resolve(response);
        } else {
          reject();
        }
      } catch (error) {
        console.error("UserService updateUser error", error);
        reject(error);
      } finally {
        const { user: storeUser, userDetails: storeUserDetails } = useUserStore.getState();
        const { data, error } = await AuthInstance.auth.refreshSession();
        const { user } = data;
        if (!error && storeUser) {
          useUserStore.getState().setUser({
            user: {...storeUser, ...user},
            userDetails: {...storeUserDetails, ...user?.user_metadata}
          });
        }
        useUserStore.getState().getUserDetails();
      }
    }),
  updateTerms: async (terms: UserTermsType) =>
    new Promise<UserTermsType>(async (resolve, reject) => {
      try {
        const user = await UserService.getUser();
        if (user?.id && Object.keys(terms)?.length) {
          const { data: response } = (await ApiService.put(
            apiUser.TERMS(user.id),
            terms
          )) as { data: UserTermsType };
          resolve(response);
        } else {
          reject();
        }
      } catch (error) {
        console.error("UserService updateTerms error", error);
        reject(error);
      } finally {
        useUserStore.getState().getUserTerms();
      }
    }),
  getTerms: async () =>
    new Promise<UserTermsType>(async (resolve, reject) => {
      try {
        const user = await UserService.getUser();
        if (user?.id) {
          const { data: response } = (await ApiService.get(
            apiUser.TERMS(user.id)
          )) as { data: UserTermsType };
          resolve(response);
        } else {
          reject();
        }
      } catch (error) {
        console.error("UserService getTerms error", error);
        reject(error);
      }
    }),
  updateDevices: async (devices: UserDevicesType) =>
    new Promise<UserDevicesType>(async (resolve, reject) => {
      try {
        const user = await UserService.getUser();
        if (user?.id) {
          const { data: response } = (await ApiService.put(
            apiUser.DEVICES(user.id),
            devices || []
          )) as { data: UserDevicesType };
          resolve(response);
        } else {
          reject();
        }
      } catch (error) {
        console.error("UserService updateDevices error", error);
        reject(error);
      } finally {
        useUserStore.getState().getUserDevices(true);
      }
    }),
  getDevices: async () =>
    new Promise<UserDevicesType>(async (resolve, reject) => {
      try {
        const user = await UserService.getUser();
        if (user?.id) {
          const { data: response } = (await ApiService.get(
            apiUser.DEVICES(user.id)
          )) as { data: UserDevicesType };
          resolve(response);
        } else {
          reject();
        }
      } catch (error) {
        console.error("UserService getDevices error", error);
        reject(error);
      }
    }),
  sendEmailVerification: async () =>
    new Promise(async (resolve, reject) => {
      const user = await UserService.getUser();
      if (user?.id) {
        const { error } = await AuthInstance.auth.resend({
          type: "signup",
          email: user.email,
          options: {
            emailRedirectTo: `${AppConstants.hostUrl}/${Routes.confirmEmail.url}`,
          },
        });

        if (error) {
          console.error("UserService sendEmailVerification error", error);
          reject(error);
        }
        resolve(user);
      } else {
        reject();
      }
    }),
  resetPassword: async (email: string) =>
    new Promise(async (resolve, reject) => {
      try {
        await RecaptchaService.checkAppToken(
          RecaptchaActionEnum.RESET_PASSWORD
        );
        const { data, error } = await AuthInstance.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${AppConstants.hostUrl}/${Routes.updatePassword.url}`,
          }
        );

        if (error) {
          reject(error);
        }
        resolve(data);
      } catch (error) {
        console.error("UserService resetPassword error", error);
        reject(error);
      }
    }),
  deleteUser: async () =>
    new Promise(async (resolve, reject) => {
      try {
        const user = await UserService.getUser();
        if (user?.id) {
          const response = await ApiService.delete(apiUser.DELETE(user.id));
          resolve(response);
        } else {
          reject();
        }
      } catch (error) {
        console.error("UserService deleteUser error", error);
        reject(error);
      }
    }),
};
