import { Request, Response } from "express";
import { RestaurantModel } from "../models/restaurantModel";
import { CityModel } from "../models/cityModel";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../repository/database";

/**
 * Create a new restaurant.
 *
 * Validates that the referenced city exists before creating the restaurant.
 *
 * @param {Request} req - Express request object containing restaurant data in body.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Returns a JSON response with the created restaurant or an error.
 */
export async function createRestaurant(
  req: Request,
  res: Response,
): Promise<void> {
  const data = req.body;

  try {
    await connectToDatabase();

    // Ensure the referenced city exists
    const cityExists = await CityModel.findById(data.city);
    if (!cityExists) {
      res.status(400).json({ message: "Invalid city ID" });
      return;
    }

    const newRestaurant = new RestaurantModel(data);
    const savedRestaurant = await newRestaurant.save();

    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ message: "Failed to create restaurant" });
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Retrieve all restaurants.
 *
 * Populates the `city` field with full city data.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Returns a JSON array of restaurants or an error.
 */
export async function getAllRestaurants(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await connectToDatabase();

    const restaurants = await RestaurantModel.find().populate("city");

    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  } finally {
    await disconnectFromDatabase();
  }
}

export async function getCityWithRestaurants(req: Request, res: Response) {
  const cityId = req.params.id;

  const city = await CityModel.findById(cityId);
  if (!city) {
    res.status(404).json({ message: "City not found" });
    return;
  }

  const restaurants = await RestaurantModel.find({ city: cityId });

  res.json({
    ...city.toObject(),
    restaurants,
  });
}

/**
 * Retrieve a single restaurant by its ID.
 *
 * Populates the `city` reference.
 *
 * @param {Request} req - Express request object containing restaurant ID in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Returns the restaurant if found, otherwise 404.
 */
export async function getRestaurantById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await connectToDatabase();

    const restaurantId = req.params.id;
    const restaurant =
      await RestaurantModel.findById(restaurantId).populate("city");

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant by ID:", error);
    res.status(500).json({ message: "Failed to fetch restaurant" });
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Update a restaurant by its ID.
 *
 * @param {Request} req - Express request object containing restaurant ID in params and updated data in body.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Returns the updated restaurant if found, otherwise 404.
 */
export async function updateRestaurantById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await connectToDatabase();

    const restaurantId = req.params.id;
    const updateData = req.body;

    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      updateData,
      { new: true },
    );

    if (!updatedRestaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ message: "Failed to update restaurant" });
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Delete a restaurant by its ID.
 *
 * @param {Request} req - Express request object containing restaurant ID in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} Returns success message if deleted, otherwise 404.
 */
export async function deleteRestaurantById(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await connectToDatabase();

    const restaurantId = req.params.id;
    const deletedRestaurant =
      await RestaurantModel.findByIdAndDelete(restaurantId);

    if (!deletedRestaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ message: "Failed to delete restaurant" });
  } finally {
    await disconnectFromDatabase();
  }
}
