import { Types } from "mongoose";

export interface Restaurant extends Document {
  id: string;
  name: string;
  cuisine: string;
  city: Types.ObjectId;
  createdAt: Date;
}
