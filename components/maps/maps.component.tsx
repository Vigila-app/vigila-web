"use client";
import { MapsUtils } from "@/src/utils/maps.utils";
import clsx from "clsx";
import { DivIcon, LatLngExpression } from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

type MapsComponentI = {
  center: LatLngExpression;
  draggable?: boolean;
  marker?: LatLngExpression;
  markerName?: string;
  markerIcon?: DivIcon;
  zoomable?: boolean;
  zoom?: number;
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

const MapInstance = (props: MapsComponentI) => {
  const map = useMap();
  const { center, zoom } = props;
  const updateMap = (coordinates: LatLngExpression) => {
    if (coordinates) {
      map.setView(coordinates, zoom);
    }
  };

  useEffect(() => {
    if (center) updateMap(center);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center]);
  return null;
};

const MapsComponent = (props: MapsComponentI) => {
  const {
    center,
    className,
    draggable = true,
    marker,
    markerName,
    markerIcon = defaultMarker,
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
        <MapInstance {...props} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {marker ? (
          <Marker position={marker} icon={markerIcon}>
            {markerName ? <Popup offset={[0, -25]}>{markerName}</Popup> : null}
          </Marker>
        ) : null}
      </MapContainer>
    </>
  );
};

export default MapsComponent;