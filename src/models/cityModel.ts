import { Schema, model } from "mongoose";
import { City } from "../interfaces/city";
import { User } from "../interfaces/user";

const citySchema = new Schema<City>({
  name: { type: String, required: true, min: 2, max: 100 },
  country: { type: String, required: true, min: 2, max: 100 },
  population: { type: Number, required: true, min: 0 },
  restaurants: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
  _createdBy: { type: String, ref: "User", required: true },
});

export const CityModel = model<City>("City", citySchema);
