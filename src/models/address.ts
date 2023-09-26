export interface CustomerAddress {
  id: string;
  place_name: string;
  place_type: string[];
  geometry: {
    bbox: number[];
    center: number[];
    coordinates: number[];
  };
}
export class AddressDTO implements CustomerAddress {
  place_name = '';

  id = '';

  reference = '';

  place_type = [];

  url = '';

  utc_offset = 0;

  vicinity = '';

  address_components = [];

  formatted_address = '';

  geometry = {
    bbox: [],
    center: [],
    coordinates: [],
  };
}

export interface StoreAddress {
  _id?: string;
  url: string;
  address: string;
}
