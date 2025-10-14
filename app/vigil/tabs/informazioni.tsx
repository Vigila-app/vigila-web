import Card from "@/components/card/card";
import { useUserStore } from "@/src/store/user/user.store";

const InformazioniTab = () => {
  const { user, userDetails } = useUserStore();

  return (
    <div className="w-full mx-auto max-w-4xl gap-6 mt-6 ">
      <Card customClass="w-full" >
        <div className="font-semibold text-xl  ">Informazioni personali</div>

        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium  text-vigil-orange">
                Nome
              </label>

              <p>{userDetails?.name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium  text-vigil-orange">
                Cognome
              </label>

              <p>{userDetails?.surname}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vigil-orange">
              Data di nascita
            </label>

            <p>{userDetails?.birthday}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vigil-orange">
              Email
            </label>
            <p>{userDetails?.email}</p>
            <p className="text-xs text-gray-500">
              Per modificare l&apos;email contatta il supporto
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vigil-orange">
              Telefono
            </label>

            <p>{userDetails?.phone}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default InformazioniTab;
