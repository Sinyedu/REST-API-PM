import { Schema, model } from "mongoose";
import { City } from "../interfaces/city";

const citySchema = new Schema({
  name: String,
  country: String,
  population: Number,
  restaurants: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }],
  createdAt: { type: Date, default: Date.now },
  _createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export const CityModel = model<City>("City", citySchema);
