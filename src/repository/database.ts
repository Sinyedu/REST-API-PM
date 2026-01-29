import mongoose from "mongoose";

export async function testConnection() {
  try {
    await connectToDatabase();
    await disconnectFromDatabase();
    console.log("Database connection test successful");
  } catch (error) {
    console.error("Database connection test failed:" + error);
  }
}

export async function connectToDatabase() {
  try {
    if (!process.env.DBHOST) {
      throw new Error("DBHOST is not defined in environment variables");
    }

    await mongoose.connect(process.env.DBHOST);

    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
      console.log("Connected to the database successfully");
    } else {
      throw new Error("Database connection is not established");
    }
  } catch (error) {
    console.error("Failed to connect to the database:" + error);
  }
}

export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from the database successfully");
  } catch (error) {
    console.error("Failed to disconnect from the database:" + error);
  }
}
