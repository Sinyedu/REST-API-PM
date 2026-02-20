import { Request, Response } from "express";
import { CityModel } from "../models/cityModel";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../repository/database";
/**
 * Creates a new city in the database.
 * @param req
 * @param res
 */

export async function createCity(req: Request, res: Response): Promise<void> {
  const data = req.body;

  try {
    await connectToDatabase();
    const newCity = new CityModel(data);
    const saveCity = await newCity.save();

    res.status(201).send(saveCity);
  } catch (error) {
    console.error("Error creating city:" + error);
    res.status(500).json({ message: "Failed to create city" });
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Fetches all cities from the database.
 * @param req
 * @param res
 */
export async function getAllCities(req: Request, res: Response): Promise<void> {
  try {
    await connectToDatabase();
    const cities = await CityModel.find();
    res.status(200).json(cities);
  } catch (error) {
    console.error("Error fetching cities:" + error);
    res.status(500).json({ message: "Failed to fetch cities" });
  } finally {
    await disconnectFromDatabase();
  }
}
