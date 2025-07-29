import { useState } from "react";

type AltchaChallengeI = {
  payload: string;
  state: "verified" | string;
};

const useAltcha = () => {
  const [altchaChallenge, setAltchaChallenge] = useState<AltchaChallengeI>({
    payload: "",
    state: "not_verified",
  });

  const onStateChange = ({ detail }: CustomEvent<AltchaChallengeI>) => {
    setAltchaChallenge(detail);
  };

  return {
    challenge: altchaChallenge.payload,
    isVerified: altchaChallenge.state === "verified",
    onStateChange,
  };
};

export default useAltcha;
