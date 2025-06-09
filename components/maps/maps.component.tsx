"use client";
import { PoiI, PoiPositionI } from "@/src/types/maps.types";
import { MapsUtils } from "@/src/utils/maps.utils";
import clsx from "clsx";
import { DivIcon, LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type MapsComponentI = {
  center: LatLngExpression;
  draggable?: boolean;
  marker?: LatLngExpression;
  markerName?: string;
  markerIcon?: DivIcon;
  zoomable?: boolean;
  zoom?: number;
  places?: {
    id: PoiI["id"];
    icon: DivIcon;
    name?: string;
    position: PoiPositionI;
  }[];
  className?: string;
};

function MapPlaceholder() {
  return (
    <div className="h-96">
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </div>
  );
}

const defaultMarker = MapsUtils.createMarkerIcon();

const MapsComponent = (props: MapsComponentI) => {
  const {
    center,
    className,
    draggable = true,
    marker,
    markerName,
    markerIcon = defaultMarker,
    places = [],
    zoom = 15,
    zoomable = true,
  } = props;
  return (
    <>
      <MapContainer
        attributionControl={false}
        center={center}
        dragging={draggable}
        zoom={zoom}
        scrollWheelZoom={zoomable}
        className={clsx("h-96 z-10", className)}
        doubleClickZoom={zoomable}
        zoomControl={zoomable}
        touchZoom={zoomable}
        placeholder={<MapPlaceholder />}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {marker ? (
          <Marker position={marker} icon={markerIcon}>
            {markerName ? <Popup offset={[0, -25]}>{markerName}</Popup> : null}
          </Marker>
        ) : null}
        {places?.length
          ? places.map((place) => (
              <Marker
                key={place.id}
                position={[
                  Number(place?.position.lat),
                  Number(place?.position.lng),
                ]}
                icon={place.icon}
              >
                {place.name ? (
                  <Popup offset={[0, -25]}>
                    <div className="space-y-2 flex flex-wrap">
                      <strong>{place.name}</strong>
                      <div className="w-full inline-flex justify-end">
                        <a
                          href={MapsUtils.openDeviceMap(
                            place?.position.lat,
                            place?.position.lng,
                            true
                          )}
                          target="_blank"
                        >
                          Get me here
                        </a>
                      </div>
                    </div>
                  </Popup>
                ) : null}
              </Marker>
            ))
          : null}
      </MapContainer>
    </>
  );
};

export default MapsComponent;
