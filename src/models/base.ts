import { Schema, SchemaDefinition } from "mongoose";
import { IUser } from "./user";

export interface IBaseModel {
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
  createdBy?: IUser;
  updatedBy?: IUser;
  deletedBy?: IUser;
}

// Base Schema
export const BaseSchemaFields: SchemaDefinition = {
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true },
  deletedAt: { type: Number, required: false },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
};

export function BaseSchemaPlugin(schema: Schema) {
  schema.add({
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
    deletedAt: { type: Number },
  });

  schema.pre("save", function () {
    this.updatedAt = Date.now();
    this.createdAt = Date.now();
  });

  schema.pre("findOneAndUpdate", function () {
    this.set({ updatedAt: Date.now() });
  });
}
