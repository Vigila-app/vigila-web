import TabGroup, { TabI } from "@/components/tabGroup/tabGroup";
import { RolesEnum } from "@/src/enums/roles.enums";
import { useUserStore } from "@/src/store/user/user.store";
import { useEffect, useState } from "react";
import TabInattesa from "@/app/vigil/tabs/TabsPrenotazioni/TabInAttesa";
import TabConfirmed from "@/app/vigil/tabs/TabsPrenotazioni/TabConfirmed";
import TabCompletati from "@/app/vigil/tabs/TabsPrenotazioni/TabCompletati";
import { useBookingsStore } from "@/src/store/bookings/bookings.store";

const PrenotationTabs = () => {
  const { user } = useUserStore();
  const { bookings, getBookings } = useBookingsStore();
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  const tabs: TabI[] = [
    {
      label: (
        <span className="text-black">
          In attesa{" "}
          <span className="bg-consumer-blue rounded-full px-2">
            {pendingBookings.length}
          </span>
        </span>
      ),

      active: true,
    },
    {
      label: (
        <span className="text-black">
          Confermate{" "}
          <span className="bg-consumer-blue rounded-full px-2">
            {confirmedBookings.length}
          </span>
        </span>
      ),
    },
    {
      label: (
        <span className="text-black">
          Completate{" "}
          <span className="bg-consumer-blue rounded-full px-2">
            {completedBookings.length}
          </span>
        </span>
      ),
    },
  ];
  const [selectedTab, setSelectedTab] = useState<TabI>(tabs[0]); //per avere tab attive
  const role: RolesEnum = user?.user_metadata?.role as RolesEnum;
  useEffect(() => {
    getBookings(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="pt-4">
      <div className=" text-[10px py-1 rounded-2xl bg-gray-200 items-center ">
        <TabGroup
          role={role}
          tabs={tabs}
          onTabChange={(tab) => setSelectedTab(tab)}
        />
      </div>

      {selectedTab.label === "In attesa" && <TabInattesa />}
      {selectedTab.label === "Accettate" && <TabConfirmed />}
      {selectedTab.label === "Completate" && <TabCompletati />}
      {/* //  ToDO popolazione delle prenotazione  */}
    </section>
  );
};
export default PrenotationTabs;
