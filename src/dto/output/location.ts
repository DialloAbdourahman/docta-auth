import { ILocation } from "../../models/location";

export class LocationOutputDto {
  address: string | null;
  city: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  zipcode: string | null;
  distanceInMeters: number | null;

  constructor(loc: ILocation) {
    this.address = loc.address ?? null;
    this.city = loc.city ?? null;
    this.country = loc.country ?? null;
    this.lat = loc.lat ?? null;
    this.lng = loc.lng ?? null;
    this.zipcode = loc.zipcode ?? null;
    this.distanceInMeters = loc.distanceInMeters ?? null;
  }
}
