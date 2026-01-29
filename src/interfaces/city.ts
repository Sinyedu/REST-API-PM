import { User } from "./user";

export interface City extends Document {
  id: string;
  name: string;
  country: string;
  population: number;
  restaurants: number;
  createdAt: Date;
  _createdBy: User["id"];
}
