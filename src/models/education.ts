import { Schema } from "mongoose";

export interface IEducation {
  year: number;
  title: string;
}

export const EducationSchema = new Schema<IEducation>(
  {
    year: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
  },
  { _id: false }
);
