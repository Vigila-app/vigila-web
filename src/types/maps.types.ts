export type AddressI = {
  city?: string;
  street?: string;
  state?: string;
  country?: string;
  postCode?: string;
  postcode?: string;
  postalCode?: string;
  intercom?: string;
  note?: string;
  lat?: string | number;
  lon?: string | number;
  extended?: string;
  q?:string
  display_name?: string;
  address?: AddressI;
};
