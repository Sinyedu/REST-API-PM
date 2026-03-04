import { Schema, model } from "mongoose";
import { Restaurant } from "../interfaces/restaurant";

const restaurantSchema = new Schema({
  name: String,
  cuisine: String,
  city: {
    type: Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const RestaurantModel = model<Restaurant>(
  "Restaurant",
  restaurantSchema,
);
