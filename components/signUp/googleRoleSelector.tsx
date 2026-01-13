"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@/components"; 
import {
  FaceSmileIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { RolesEnum } from "@/src/enums/roles.enums";
import { AuthService, ApiService } from "@/src/services";
import { apiUser } from "@/src/constants/api.constants";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import { Routes } from "@/src/routes";
import clsx from "clsx";
import Link from "next/link";

// Stato iniziale dei termini
const defaultTerms = {
  "legal-1": false,
  "terms-and-conditions-1": false,
  "marketing-1": false,
};

export default function GoogleRoleSelector() {
  const router = useRouter();
  const { showLoader, hideLoader, showToast } = useAppStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedRole, setSelectedRole] = useState<RolesEnum | null>(null);
  const [terms, setTerms] = useState(defaultTerms);
  const [showModal, setShowModal] = useState(false);

  // Gestione click sulla card
  const handleRoleSelect = (role: RolesEnum) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  // Gestione checkbox
  const toggleTerm = (key: keyof typeof defaultTerms) => {
    setTerms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isFormValid = terms["legal-1"] && terms["terms-and-conditions-1"];

  const handleConfirm = async () => {
    if (!selectedRole || !isFormValid) return;
    try {
      setIsSubmitting(true);
      showLoader();

      const token = await AuthService.getAuthToken();

      const response = (await ApiService.post(
        apiUser.COMPLETE_GOOGLE(),
        {
          role: selectedRole,
          terms: terms,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )) as any;

      // ApiService.responseMiddlewares already throws on non-ok responses
      const data = response || {};

      showToast({
        message: "Profilo completato con successo!",
        type: ToastStatusEnum.SUCCESS,
      });

      try {
        await AuthService.renewAuthentication();
      } catch (e) {
        console.warn("Session refresh failed:", e);
      }

      const nextRoute =
        selectedRole === RolesEnum.CONSUMER
          ? Routes.onBoard.url
          : Routes.onBoardVigil.url;

      router.refresh();
      router.replace(nextRoute);
    } catch (error: any) {
      console.error(error);
      showToast({
        message: error?.message || "Errore sconosciuto",
        type: ToastStatusEnum.ERROR,
      });
    } finally {
      hideLoader();
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="my-6 space-y-4">
        <div
          onClick={() => handleRoleSelect(RolesEnum.CONSUMER)}
          className="cursor-pointer group">
          <Card
            containerClass={clsx(
              "flex flex-col items-center justify-center p-6 transition duration-200 border-2 rounded-2xl",
              "group-hover:scale-[1.02] group-hover:shadow-md",
              selectedRole === RolesEnum.CONSUMER
                ? "border-consumer-blue bg-consumer-light-blue/10"
                : "border-transparent bg-white"
            )}>
            <div className="text-consumer-blue flex flex-col items-center">
              <HeartIcon className="h-10 w-10 mb-3" />
              <h4 className="font-bold text-lg">Famiglia</h4>
              <p className="text-gray-600 text-sm mt-1 text-center">
                Cerco assistenza per i miei cari da un professionista fidato.
              </p>
            </div>
          </Card>
        </div>

        <div
          onClick={() => handleRoleSelect(RolesEnum.VIGIL)}
          className="cursor-pointer group">
          <Card
            containerClass={clsx(
              "flex flex-col items-center justify-center p-6 transition duration-200 border-2 rounded-2xl",
              "group-hover:scale-[1.02] group-hover:shadow-md",
              selectedRole === RolesEnum.VIGIL
                ? "border-vigil-orange bg-vigil-light-orange/10"
                : "border-transparent bg-white"
            )}>
            <div className="text-vigil-orange flex flex-col  items-center">
              <FaceSmileIcon className="h-10 w-10 mb-3" />
              <h4 className="font-bold text-lg">Vigil (Operatore)</h4>
              <p className="text-gray-600 text-sm mt-1 text-center">
                Voglio lavorare, guadagnare ed avere impatto nella società.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {showModal && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="text-center mb-6">
              <div
                className={clsx(
                  "mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3",
                  selectedRole === RolesEnum.CONSUMER
                    ? "bg-consumer-light-blue text-consumer-blue"
                    : "bg-vigil-light-orange text-vigil-orange"
                )}>
                {selectedRole === RolesEnum.CONSUMER ? (
                  <HeartIcon className="h-7 w-7" />
                ) : (
                  <FaceSmileIcon className="h-7 w-7" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Conferma profilo{" "}
                {selectedRole === RolesEnum.CONSUMER ? "Famiglia" : "Vigil"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Per completare la registrazione, accetta i termini necessari.
              </p>
            </div>

            <div className="space-y-4 mb-8 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl">
              <label
                htmlFor="terms-and-conditions-1"
                className="flex gap-3 cursor-pointer items-start">
                <input
                  id="terms-and-conditions-1"
                  type="checkbox"
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={terms["terms-and-conditions-1"]}
                  onChange={() => toggleTerm("terms-and-conditions-1")}
                />
                <span>
                  Accetto i{" "}
                  <Link
                    href={Routes.termsConditions?.url || "#"}
                    className="underline font-medium">
                    Termini e Condizioni
                  </Link>{" "}
                  *
                </span>
              </label>

              <label className="flex gap-3 cursor-pointer items-start">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={terms["legal-1"]}
                  onChange={() => toggleTerm("legal-1")}
                />
                <span>
                  Ho letto la{" "}
                  <Link
                    href={Routes.privacyPolicy?.url || "#"}
                    className="underline font-medium">
                    Privacy Policy
                  </Link>{" "}
                  *
                </span>
              </label>

              <label
                htmlFor="marketing-1"
                className="flex gap-3 cursor-pointer items-start opacity-80">
                <input
                  id="marketing-1"
                  type="checkbox"
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={terms["marketing-1"]}
                  onChange={() => toggleTerm("marketing-1")}
                />
                <span>Acconsento al marketing (Opzionale)</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-1/3 py-2.5 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition">
                Annulla
              </button>
              <div className="w-2/3">
                <Button
                  full
                  label="Completa Registrazione"
                  action={handleConfirm}
                  isLoading={isSubmitting}
                  disabled={!isFormValid || isSubmitting}
                  customClass={clsx(
                    !isFormValid && "opacity-50 cursor-not-allowed",
                    selectedRole === RolesEnum.CONSUMER
                      ? "bg-consumer-blue hover:bg-blue-600"
                      : "bg-vigil-orange hover:bg-orange-600"
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
