import { Schema } from "mongoose";

export interface IFaq {
  title: string;
  description: string;
}

export const FaqSchema = new Schema<IFaq>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);
