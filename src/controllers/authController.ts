import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi, { ValidationResult } from "joi";
import { UserModel } from "../models/userModel";
import { User } from "../interfaces/user";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../repository/database";
// LOL HAHAHA
/**
 * Logs in a user by validating their credentials and generating a JWT token.
 * @param req
 * @param res
 * @returns
 */
export async function loginUser(req: Request, res: Response) {
  try {
    const { error } = validateUserDataLogin(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    await connectToDatabase();

    const user: User | null = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      const checkHashedPassword: boolean = await bcrypt.compare(
        req.body.password,
        user.password,
      );

      if (!checkHashedPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const userId: string = user.id;
      const token: string = jwt.sign(
        {
          name: user.username,
          email: user.email,
          id: userId,
        },
        process.env.JWT_SECRET_TOKEN as string,
        { expiresIn: "1h" },
      );
      return res.status(200).json({
        message: "Login successful",
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to login user" + error });
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Registers a new user in the database.
 * @param req
 * @param res
 */

export async function registerUser(req: Request, res: Response) {
  try {
    const { error } = validateUserDataLogin(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    await connectToDatabase();
    const emailExists = await UserModel.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const userObject = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const savedUser = await userObject.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user", error: error });
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Validates user data for login and registration (email and password).
 * @param data
 */

export function validateUserDataLogin(data: User): ValidationResult {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(7).max(50).required(),
  });
  return schema.validate(data);
}
