"use client";

import dynamic from "next/dynamic";
import { UserService } from "@/src/services";
import { useModalStore } from "@/src/store/modal/modal.store";
import { useUserStore } from "@/src/store/user/user.store";
import { useState } from "react";

const sentVerificationEmailModal = "sent-verification-email-modal";

const Button = dynamic(() => import("@/components/button/button"));
const FloatingBanner = dynamic(
  () => import("@/components/floatingBanner/floatingBanner")
);
const ModalBase = dynamic(
  () => import("@/components/@core/modal/modalBase.component")
);

type VerifyEmailComponentI = {
  position?: "top" | "bottom";
};
const VerifyEmailComponent = (props: VerifyEmailComponentI) => {
  const userDetails = useUserStore((state) => state.userDetails);
  const { openModal } = useModalStore();
  const { position = "top" } = props;
  const [hide, setHide] = useState(userDetails?.email_verified || false);

  const sendVerificationEmail = async () => {
    try {
      await UserService.sendEmailVerification();
      openModal?.(sentVerificationEmailModal);
      setHide(true);
    } catch (err) {
      console.error("Error sending verification email", err);
    }
  };

  if (userDetails?.email_verified || hide) return;

  return (
    <>
      <FloatingBanner position={position} animated bgColor="bg-yellow-500">
        Verify your email or&nbsp;
        <Button
          text
          action={sendVerificationEmail}
          className="inline-block underline"
          label="send new verification email"
        />
      </FloatingBanner>
      <ModalBase modalId={sentVerificationEmailModal} closable title="Success">
        New verification email sent to&nbsp;
        <span className="font-medium">{userDetails?.email}</span>
      </ModalBase>
    </>
  );
};

export default VerifyEmailComponent;