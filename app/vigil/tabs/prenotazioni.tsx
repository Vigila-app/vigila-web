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
        <span className="flex">
          <span className="">
            In attesa&nbsp;
            {pendingBookings.length !== 0 && (
              <span className="tab-buttons bg-vigil-orange">
                {pendingBookings.length <= 99 ? pendingBookings.length : "99+"}
              </span>
            )}
          </span>
        </span>
      ),

      active: true,
      id: "In attesa",
    },
    {
      label: (
        <span className="flex">
          <span className="">
            Accettate&nbsp;
            {confirmedBookings.length !== 0 && (
              <span className="tab-buttons bg-consumer-blue">
                {confirmedBookings.length <= 99
                  ? confirmedBookings.length
                  : "99+"}
              </span>
            )}
          </span>
        </span>
      ),
      id: "Accettate",
    },
    {
      label: (
        <span className="flex">
          <span className="">
            Completate&nbsp;
            {completedBookings.length !== 0 && (
              <span className="tab-buttons bg-green-500">
                {completedBookings.length <= 99
                  ? completedBookings.length
                  : "99+"}
              </span>
            )}
          </span>
        </span>
      ),
      id: "Completate",
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
      <div className=" text-[10px] py-1 rounded-2xl bg-gray-200 items-center ">
        <TabGroup
          role={role}
          tabs={tabs}
          align="center"
          onTabChange={(tab) => setSelectedTab(tab)}
        />
      </div>

      {selectedTab.id === "In attesa" && <TabInattesa />}
      {selectedTab.id === "Accettate" && <TabConfirmed />}
      {selectedTab.id === "Completate" && <TabCompletati />}
      {/* //  ToDO popolazione delle prenotazione  */}
    </section>
  );
};
export default PrenotationTabs;
