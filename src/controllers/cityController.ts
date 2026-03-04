import { Request, Response } from "express";
import { CityModel } from "../models/cityModel";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../repository/database";
import { RestaurantModel } from "../models/restaurantModel";
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

/**
 * Fetches a city by its ID from the database.
 * @param req
 * @param res
 * @returns
 */

export async function getCityById(req: Request, res: Response) {
  try {
    await connectToDatabase();
    const cityId = req.params.id;
    const city = await CityModel.findById(cityId);

    if (!city) {
      res.status(404).json({ message: "City not found" });
      return;
    }
    res.status(200).json(city);
  } catch (error) {
    console.error("Error fetching city by ID:" + error);
    res.status(500).json({ message: "Failed to fetch city" });
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 *
 * @param req
 * @param res
 * @returns
 */
export async function getCityWithRestaurants(req: Request, res: Response) {
  try {
    await connectToDatabase();
    const cityId = req.params.id;
    const city = await CityModel.findById(cityId);

    if (!city) {
      res.status(404).json({ message: "City not found" });
      return;
    }
    const restaurants = await RestaurantModel.find({ city: cityId });

    res.status(200).json({ ...city.toObject(), restaurants });
  } catch (error) {
    console.error("Error fetching city with restaurants:" + error);
    res.status(500).json({ message: "Failed to fetch city with restaurants" });
  } finally {
    await disconnectFromDatabase();
  }
}
/**
 *
 * @param req
 * @param res
 * @returns
 */
export async function updateCityById(req: Request, res: Response) {
  try {
    await connectToDatabase();
    const cityId = req.params.id;
    const updateData = req.body;
    const updatedCity = await CityModel.findByIdAndUpdate(cityId, updateData, {
      new: true,
    });

    if (!updatedCity) {
      res.status(404).json({ message: "City not found" });
      return;
    }
    res.status(200).json(updatedCity);
  } catch (error) {
    console.error("Error updating city by ID:" + error);
    res.status(500).json({ message: "Failed to update city" });
  } finally {
    await disconnectFromDatabase();
  }
}
/**
 *
 * @param req
 * @param res
 * @returns
 */
export async function deleteCityById(req: Request, res: Response) {
  try {
    await connectToDatabase();
    const cityId = req.params.id;
    const deletedCity = await CityModel.findByIdAndDelete(cityId);

    if (!deletedCity) {
      res.status(404).json({ message: "City not found" });
      return;
    }
    res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    console.error("Error deleting city by ID:" + error);
    res.status(500).json({ message: "Failed to delete city" });
  } finally {
    await disconnectFromDatabase();
  }
}
