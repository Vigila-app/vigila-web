import Card from "@/components/card/card";
import Reservation from "@/components/reservation/reservationComponent";

export default function TabInattesa() {
  return (
    <div>
      <h1 className="py-3 text-[18px] font-semibold">Richieste in arrivo</h1>
      
        <Reservation/>
      
    </div>
  );
}
