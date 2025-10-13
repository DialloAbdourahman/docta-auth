import { Schema } from "mongoose";

export interface IPosition {
  startDate: number; // timestamp (ms)
  endDate?: number; // timestamp (ms), optional
  title: string;
  company: string;
}

export const PositionSchema = new Schema<IPosition>(
  {
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: false },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
  },
  { _id: false }
);

