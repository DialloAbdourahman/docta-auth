import { Schema } from "mongoose";

export interface ILocation {
  address?: string;
  city?: string;
  country?: string; // ISO code eg: fr
  lat?: number;
  lng?: number;
  zipcode?: string;
  distanceInMeters?: number | null;
}

export const LocationSchema = new Schema<ILocation>(
  {
    address: { type: String, required: false, trim: true },
    city: { type: String, required: false, trim: true },
    country: { type: String, required: false, trim: true },
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
    zipcode: { type: String, required: false, trim: true },
    distanceInMeters: { type: Number, required: false, default: null },
  },
  { _id: false }
);
