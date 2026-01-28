"use client";

import { MapsComponent } from "@/components/maps";
import SearchAddress from "@/components/maps/searchAddress.component";
import { useCurrentLocation } from "@/src/hooks/useCurrentLocation";
import { UserService } from "@/src/services";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import {
  AvailabilityRulesDemo,
  UnavailabilitiesDemo,
  AvailableSlotsDemo,
} from "@/components/calendar-demo";

const PlaygroundComponent = (props: { data?: any }) => {
  const { data = "{}" } = props;
  const { currentLocation } = useCurrentLocation({ onRender: true });
  const [mapPosition, setMapPosition] = useState<LatLngExpression | null>(
    currentLocation
      ? [currentLocation.latitude, currentLocation.longitude]
      : null
  );
  const [activeTab, setActiveTab] = useState<"maps" | "calendar">("calendar");

  const test = async () => {
    try {
      const user = await UserService.getUser();
      console.log("PlaygroundComponent test", user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentLocation) {
      setMapPosition([currentLocation.latitude, currentLocation.longitude]);
    }
  }, [currentLocation]);

  useEffect(() => {
    test();
  }, []);

  console.log("data", JSON.parse(data));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">Vigila Playground</h1>
        <p className="text-gray-600">
          Test and showcase various API integrations and features
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "calendar"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Calendar & Availability APIs
            </button>
            <button
              onClick={() => setActiveTab("maps")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "maps"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Maps Integration
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "calendar" && (
            <div className="space-y-8">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold">Calendar & Availability System</h2>
                <p className="text-gray-600">
                  This section demonstrates the calendar and availability system APIs.
                  Test CRUD operations for availability rules, unavailabilities, and
                  the availability engine that calculates bookable time slots.
                </p>
              </div>

              {/* Availability Rules Demo */}
              <AvailabilityRulesDemo />

              {/* Unavailabilities Demo */}
              <UnavailabilitiesDemo />

              {/* Available Slots Demo */}
              <AvailableSlotsDemo />
            </div>
          )}

          {activeTab === "maps" && (
            <div className="space-y-8">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold">Maps Integration</h2>
                <p className="text-gray-600">
                  Test the maps integration with address search and location display.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-semibold mb-4">Map Integration</h4>
                <SearchAddress
                  location
                  onSubmit={(address) => {
                    console.log("Address selected:", address);
                    if (address?.lat && address?.lon)
                      setMapPosition([Number(address.lat), Number(address.lon)]);
                  }}
                />
                {mapPosition ? (
                  <div className="mt-4">
                    <MapsComponent center={mapPosition} />
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PlaygroundComponent;