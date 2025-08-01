export type AddressI = {
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  county?: string;
  street?: string;
  state?: string;
  quarter?: string;
  country?: string;
  postCode?: string;
  postalCode?: string;
  postcode?: string;
  cap?: string;
  intercom?: string;
  note?: string;
  lat?: string | number;
  lon?: string | number;
  extended?: string;
  q?:string
  display_name?: string;
  address?: AddressI;
};
