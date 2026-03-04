import bcrypt from "bcrypt";
import dotenvFlow from "dotenv-flow";
import { faker } from "@faker-js/faker";

import { CityModel } from "../models/cityModel";
import { RestaurantModel } from "../models/restaurantModel";
import { UserModel } from "../models/userModel";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../repository/database";

dotenvFlow.config();
/**
 * Seed the database with data
 */
export async function seed() {
  try {
    await connectToDatabase();

    await deleteAllData();
    await seedData();
    console.log("Seeding process completed successfully...");
    process.exit();
  } catch (err) {
    console.log("Error Seeding data." + err);
  } finally {
    await disconnectFromDatabase();
  }
}

/**
 * Delete all data from the database
 */
export async function deleteAllData() {
  await CityModel.deleteMany();
  await UserModel.deleteMany();

  console.log("Cleared data successfully...");
}

/**
 * Seed data into the database
 */
export async function seedData() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("12345678", salt);

  const user1 = await new UserModel({
    username: faker.person.fullName(),
    email: faker.internet.email(),
    password: passwordHash,
  }).save();

  const user2 = await new UserModel({
    username: faker.person.fullName(),
    email: faker.internet.email(),
    password: passwordHash,
  }).save();

  const cities = [];

  for (let index = 0; index < 10; index++) {
    const city = await new CityModel({
      name: faker.location.city(),
      country: faker.location.country(),
      population: faker.number.int({ min: 1000, max: 100000 }),
      restaurants: [],
      _createdBy: user1.id,
    }).save();

    cities.push(city);
  }

  for (let index = 0; index < 20; index++) {
    const randomCity = faker.helpers.arrayElement(cities);

    await new RestaurantModel({
      name: faker.company.name(),
      cuisine: faker.food.ethnicCategory(),
      city: randomCity._id,
      _createdBy: user2.id,
    }).save();
  }

  console.log("Seeded data successfully...");
}

// start the actual seeding
seed();
