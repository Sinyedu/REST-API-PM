import { Types } from "mongoose";
import { City } from "./city";

export interface Restaurant extends Document {
  id: string;
  name: string;
  cuisine: string;
  city: Types.ObjectId;
  createdAt: Date;
}
