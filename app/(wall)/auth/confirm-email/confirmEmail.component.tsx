"use client";

import { ButtonLink } from "@/components";
import { useRouter } from "next/navigation";
import { Routes } from "@/src/routes";

const ConfirmEmailComponent = () => {
  const router = useRouter();

  const redirectLogin = () => {
    router.replace(Routes.login.url);
  };

  return (
    <div className="bg-white w-full mx-auto my-6 max-w-lg p-6 md:p-8 rounded-lg shadow-lg">
      <div className="space-y-6">
        <div>
          <h2 className="text-center font-medium">Confirm email</h2>
          <p className="text-center text-sm text-gray-500 mt-2">
            Your email has been succesfully confirmed!
          </p>
        </div>

      </div>

      <div className="space-y-2 mt-6">
        <p className="text-center text-sm text-gray-500">
          Go to&nbsp;
          <ButtonLink
            inline
            text
            label={Routes.login.label}
            href={Routes.login.url}
          />
        </p>
      </div>
    </div>
  );
};

export default ConfirmEmailComponent;
