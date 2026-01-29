import { Schema, model } from "mongoose";
import { User } from "../interfaces/user";

const userSchema = new Schema<User>({
  username: { type: String, required: true, min: 3, max: 50 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 7, max: 50 },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = model<User>("User", userSchema);
