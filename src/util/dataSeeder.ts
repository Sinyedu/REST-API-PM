import bcrypt from "bcrypt";
import dotenvFlow from "dotenv-flow";
import { faker } from '@faker-js/faker';

// Project import
import { CityModel } from "../models/cityModel";
import { UserModel } from "../models/userModel";
import { connectToDatabase, disconnectFromDatabase } from "../repository/database";

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
    }
    finally {
        await disconnectFromDatabase();
    }
};

/**
 * Delete all data from the database
 */
export async function deleteAllData() {
    await CityModel.deleteMany();
    await UserModel.deleteMany();

    console.log("Cleared data successfully...");
};

/**
 * Seed data into the database
 */
export async function seedData() {
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("12345678", salt);

    const user1 = new UserModel();
    user1.username = faker.person.fullName();
    user1.email = faker.internet.email();
    user1.password = passwordHash;
    await user1.save();

    const user2 = new UserModel();
    user2.username = faker.person.fullName();
    user2.email = faker.internet.email();
    user2.password = passwordHash;
    await user2.save();

    // Generate fake city
    for (let index = 0; index < 10; index++) {
        await new CityModel
        (
            {
                name: faker.location.city(),
                country: faker.location.country(),
                population: faker.number.int({ min: 1000, max:100000}),
                restaurants: faker.number.int ({ min: 10, max:1000}),
                _createdBy: user1.id
            }
        ).save();
    }

    console.log("Seeded data successfully...");
};


// start the actual seeding
seed();