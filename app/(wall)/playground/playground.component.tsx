"use client";

import { MapsComponent } from "@/components/maps";
import SearchAddress from "@/components/maps/searchAddress.component";
import { useCurrentLocation } from "@/src/hooks/useCurrentLocation";
import { UserService } from "@/src/services";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import TestAIComponent from "./testAI.component";

const PlaygroundComponent = (props: { data?: any }) => {
  const { data = "{}" } = props;
  const { currentLocation } = useCurrentLocation({ onRender: true });
  const [mapPosition, setMapPosition] = useState<LatLngExpression | null>(
    currentLocation
      ? [currentLocation.latitude, currentLocation.longitude]
      : null
  );

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
    <div>
      <h1>Playground Component</h1>
      <div className="my-8">
        <h4>Map Integration</h4>
        <SearchAddress
          location
          onSubmit={(address) => {
            console.log("Address selected:", address);
            if (address?.lat && address?.lon)
              setMapPosition([Number(address.lat), Number(address.lon)]);
          }}
        />
        {mapPosition ? <MapsComponent center={mapPosition} /> : null}
      </div>
      <div className="my-8">
        <h4>Test AI Integration</h4>
        <TestAIComponent />
      </div>
    </div>
  );
};
export default PlaygroundComponent;
