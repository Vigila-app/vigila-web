import Card from "@/components/card/card";
import { useUserStore } from "@/src/store/user/user.store";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { useEffect } from "react";

const InformazioniTab = () => {
  const { user, userDetails } = useUserStore();
  const { vigils, getVigilsDetails } = useVigilStore();
  const vigilId = user?.id;

  useEffect(() => {
    if (vigilId) {
      getVigilsDetails([vigilId], true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigilId]);

  const vigil = vigils.find((v) => v.id === vigilId);
  return (
    <div className="w-full mx-auto max-w-4xl gap-6 mt-6 ">
      <Card customClass="w-full">
        <div className="font-semibold text-xl  ">Informazioni personali</div>

        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium  text-vigil-orange">
              Nome e Cognome
            </label>

            <p>{vigil?.displayName}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vigil-orange">
              Data di nascita
            </label>
            <p>{vigil?.birthday}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vigil-orange">
              Email
            </label>
            <p>{user?.email}</p>
            <p className="text-xs text-gray-500">
              Per modificare l&apos;email contatta il supporto
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vigil-orange">
              Telefono
            </label>
            <p>{vigil?.phone}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default InformazioniTab;
