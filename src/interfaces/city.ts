import { Types, Document } from "mongoose";

export interface City extends Document {
  name: string;
  country: string;
  population: number;
  restaurants?: Types.ObjectId[];
  createdAt: Date;
  _createdBy?: Types.ObjectId;
}
