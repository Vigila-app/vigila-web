export type AddressI = {
  city: string;
  street: string;
  state: string;
  country: string;
  postalCode: string;
  intercom?: string;
  note?: string;
  lat?: string;
  lon?: string;
  extended?: string;
};

// region POI
export type PoiAddressI = {
  city: string;
  countryCode: string;
  countryName: string;
  county: string;
  countyCode: string;
  label: string;
  postalCode: string;
  state: string;
  street: string;
};
export type PoiCategoryI = {
  id: string;
  name: string;
  primary?: boolean;
};
export type PoiPositionI = {
  lat: string;
  lng: string;
};

export type PoiI = {
  address: PoiAddressI;
  categories: PoiCategoryI[];
  id: string;
  position: PoiPositionI;
  title: string;
};
// endregion POI
