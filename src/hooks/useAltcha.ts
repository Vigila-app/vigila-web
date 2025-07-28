import { useState } from "react";

type AltchaChallangeI = {
  payload: string;
  state: "verified" | string;
};

const useAltcha = () => {
  const [altchaChallange, setAltchaChallange] = useState<AltchaChallangeI>({
    payload: "",
    state: "not_verified",
  });

  const onStateChange = ({ detail }: CustomEvent<AltchaChallangeI>) => {
    setAltchaChallange(detail);
  };

  return {
    challange: altchaChallange.payload,
    isVerified: altchaChallange.state === "verified",
    onStateChange,
  };
};

export default useAltcha;
