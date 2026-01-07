import { AppInstance } from "@/src/utils/supabase.utils";
import { HeadersEnum } from "@/src/enums/headers.enums";
import { useAppStore } from "@/src/store/app/app.store";
import { ApiService, UserService } from "@/src/services";
import { UserTermsType } from "@/src/types/user.types";
import { useModalStore } from "@/src/store/modal/modal.store";
import { useUserStore } from "@/src/store/user/user.store";
import { apiUser } from "@/src/constants/api.constants";
import { useServicesStore } from "@/src/store/services/services.store";
import { isServer } from "@/src/utils/common.utils";
import { Session, User } from "@supabase/supabase-js";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";
import { useConsumerStore } from "@/src/store/consumer/consumer.store";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { AppConstants } from "@/src/constants";
import { Routes } from "@/src/routes";
import { isReleased } from "@/src/utils/envs.utils";

export const AuthInstance = AppInstance;

export const AuthService = {
  signup: async (
    formData: {
      email: string;
      password: string;
      name: string;
      surname: string;
      role: RolesEnum;
    },
    terms: UserTermsType
  ) =>
    new Promise(async (resolve, reject) => {
      try {
        // await RecaptchaService.checkAppToken(RecaptchaActionEnum.SIGNUP);
        const { email, password, name, surname, role } = formData;
        const response = (await ApiService.post(apiUser.SIGNUP(), {
          email,
          password,
          name,
          surname,
          terms,
          role,
        })) as { data: { user: User } };
        if (response?.data?.user?.id) {
          if (!isReleased) {
            await AuthService.login(email, password);
          }
          resolve(response.data);
        } else {
          reject();
        }
      } catch (error) {
        console.error("AuthService signup error", error);
        reject(error);
      }
    }),
  login: async (email: string, password: string) =>
    new Promise(async (resolve, reject) => {
      try {
        // await RecaptchaService.checkAppToken(RecaptchaActionEnum.LOGIN);
        const { data: user, error } = await AppInstance.auth.signInWithPassword(
          {
            email,
            password,
          }
        );
        if (!error && user) resolve(user);
        reject();
      } catch (error) {
        console.error("AuthService login error", error);
        reject(error);
      }
    }),
  logout: async () =>
    new Promise(async (resolve, reject) => {
      try {
        await AppInstance.auth.signOut();
        resolve(true);
      } catch (error) {
        console.error("AuthService logout error", error);
        reject(error);
      } finally {
        useAppStore.getState().onLogout();
        useBookingsStore.getState().onLogout();
        useConsumerStore.getState().onLogout();
        useVigilStore.getState().onLogout();
        useModalStore.getState().onLogout();
        useServicesStore.getState().onLogout();
        useUserStore.getState().onLogout();
      }
    }),
  getAuthToken: async () =>
    new Promise(async (resolve, reject) => {
      try {
        if (AuthInstance) {
          const { data, error } = await AppInstance.auth.getSession();

          const token = data.session?.access_token;
          if (token) resolve(token);
          reject();
        } else {
          const check = await UserService.getUser();
          if (!check) reject();
          if (!isServer) resolve(AuthService.getAuthToken());
        }
      } catch (error) {
        console.error("AuthService getAuthToken error", error);
        reject(error);
      }
    }),
  renewAuthentication: async () =>
    new Promise<Session>(async (resolve, reject) => {
      try {
        if (AuthInstance) {
          const { data, error } = await AppInstance.auth.refreshSession();
          if (error) reject(error);
          const { session, user } = data;
          if (session && user) resolve(session);
          reject();
        } else {
          reject();
        }
      } catch (error) {
        console.error("AuthService reauthenticate error", error);
        reject(error);
      }
    }),
  getAuthHeaders: (headers: Headers) => {
    const appToken = headers?.get(HeadersEnum.APP_TOKEN);
    const authToken = headers?.get(HeadersEnum.AUTH_TOKEN);
    const user = headers?.get(HeadersEnum.USER);

    return { appToken, authToken, user };
  },

  resendConfirmation: async (
    email: string,
    redirectUrl = `${AppConstants.hostUrl}${Routes.login.url}`
  ) =>
    new Promise(async (resolve, reject) => {
      try {
        if (!email) return reject(new Error("Email required"));
        const options = redirectUrl ? { emailRedirectTo: redirectUrl } : {};
        const { error } = await AppInstance.auth.resend({
          type: "signup",
          email,
          options,
        });
        if (error) return reject(error);
        resolve(true);
      } catch (error) {
        console.error("AuthService resendConfirmation error", error);
        reject(error);
      }
    }),

  passwordReset: (email: string) => {
    new Promise(async (resolve, reject) => {
      try {
        if (!email) return reject(new Error("Email required"));

        const { data, error } = await AppInstance.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${AppConstants.hostUrl}/update-password`,
          }
        );
        console.log(data);
        if (error) return reject(error);
        resolve(true);
      } catch (error) {
        console.error("AuthService resendConfirmation error", error);
        reject(error);
      }
    });
  },

  // region 3RD PARTIES SIGN-IN PROVIDERS
  // googleLogin: async () =>
  //   new Promise((resolve, reject) => {
  //     const provider: GoogleAuthProvider = new GoogleAuthProvider();
  //     signInWithPopup(AuthInstance, provider)
  //       .then((result) => {
  //         const credential = GoogleAuthProvider.credentialFromResult(result);
  //         if (credential) {
  //           // The signed-in user info.
  //           const user = result.user;
  //           const userDetails: AdditionalUserInfo | null =
  //             getAdditionalUserInfo(result);
  //           if (userDetails?.isNewUser && userDetails?.profile) {
  //             const { email, family_name, given_name, locale, picture } =
  //               userDetails.profile;

  //             UserService.updateUser(
  //               {
  //                 displayName: `${given_name} ${family_name}`,
  //                 photoURL: picture?.toString(),
  //               },
  //               {
  //                 name: given_name?.toString() || "",
  //                 surname: family_name?.toString() || "",
  //                 email: email?.toString() || "",
  //                 /*other: {
  //                   locale: locale?.toString() || "",
  //                 },*/
  //               }
  //             );
  //           }
  //           resolve(user);
  //         } else {
  //           reject();
  //         }
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   }),
  // appleLogin: async () =>
  //   new Promise((resolve, reject) => {
  //     const provider: OAuthProvider = new OAuthProvider("apple.com");
  //     signInWithPopup(AuthInstance, provider)
  //       .then((result) => {
  //         const credential = OAuthProvider.credentialFromResult(result);
  //         if (credential) {
  //           // The signed-in user info.
  //           const user = result.user;
  //           const userDetails: AdditionalUserInfo | null =
  //             getAdditionalUserInfo(result);
  //           if (userDetails?.isNewUser && userDetails?.profile) {
  //             const { email, family_name, given_name, locale, picture } =
  //               userDetails.profile;

  //             UserService.updateUser(
  //               {
  //                 displayName: `${given_name} ${family_name}`,
  //                 photoURL: picture?.toString(),
  //               },
  //               {
  //                 name: given_name?.toString() || "",
  //                 surname: family_name?.toString() || "",
  //                 email: email?.toString() || "",
  //                 /*other: {
  //                   locale: locale?.toString() || "",
  //                 },*/
  //               }
  //             );
  //           }
  //           resolve(user);
  //         } else {
  //           reject();
  //         }
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   }),
  // providerLogin: async (provider: ProviderEnum) =>
  //   new Promise(async (resolve, reject) => {
  //     try {
  //       useAppStore.getState().showLoader();
  //       switch (provider) {
  //         case ProviderEnum.GOOGLE: {
  //           try {
  //             await AuthService.googleLogin();
  //             resolve(true);
  //           } catch (error) {
  //             console.error(
  //               "Error authenticating user with provider",
  //               provider.toUpperCase(),
  //               error
  //             );
  //             useAppStore.getState().showToast({
  //               message: "Sorry, something went wrong",
  //               type: ToastStatusEnum.ERROR,
  //             });
  //             reject();
  //           }
  //           break;
  //         }
  //         case ProviderEnum.APPLE: {
  //           try {
  //             await AuthService.appleLogin();
  //             resolve(true);
  //           } catch (error) {
  //             console.error(
  //               "Error authenticating user with provider",
  //               provider.toUpperCase(),
  //               error
  //             );
  //             useAppStore.getState().showToast({
  //               message: "Sorry, something went wrong",
  //               type: ToastStatusEnum.ERROR,
  //             });
  //             reject();
  //           }
  //           break;
  //         }
  //       }
  //     } catch (error) {
  //       console.error(
  //         "AuthService providerLogin error",
  //         provider.toUpperCase(),
  //         error
  //       );
  //       reject(error);
  //     } finally {
  //       useAppStore.getState().hideLoader();
  //     }
  //   }),
  // endregion 3RD PARTIES SIGN-IN PROVIDERS
};
