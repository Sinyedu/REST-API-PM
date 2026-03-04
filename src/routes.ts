import { Router, Request, Response } from "express";
import {
  createCity,
  getAllCities,
  getCityById,
  getCityWithRestaurants,
  updateCityById,
  deleteCityById,
} from "./controllers/cityController";

import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
} from "./controllers/restaurantController";

import { loginUser, registerUser } from "./controllers/authController";
import { verifyToken } from "./middleware/verifyToken";

const router: Router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API welcome message
 */
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the City API!");
});

/////////////////////
// Auth Endpoints
/////////////////////

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (validation error or email exists)
 *       500:
 *         description: Server error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", loginUser);

/////////////////////
// City Endpoints
/////////////////////

/**
 * @swagger
 * tags:
 *   name: Cities
 *   description: City management endpoints
 */

/**
 * @swagger
 * /cities:
 *   post:
 *     summary: Create a new city
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       201:
 *         description: City created successfully
 *       500:
 *         description: Server error
 */
router.post("/cities", createCity);

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Get all cities
 *     tags: [Cities]
 *     responses:
 *       200:
 *         description: List of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 *       500:
 *         description: Server error
 */
router.get("/cities", getAllCities);

/**
 * @swagger
 * /cities/{id}:
 *   get:
 *     summary: Get a city by ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: City ID
 *     responses:
 *       200:
 *         description: City found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       404:
 *         description: City not found
 *       500:
 *         description: Server error
 */
router.get("/cities/:id", getCityById);

/**
 * @swagger
 * /cities/{id}/restaurants:
 *   get:
 *     summary: Get a city along with its restaurants
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: City ID
 *     responses:
 *       200:
 *         description: City with restaurants
 *       404:
 *         description: City not found
 *       500:
 *         description: Server error
 */
router.get("/cities/:id/restaurants", getCityWithRestaurants);

/**
 * @swagger
 * /cities/{id}:
 *   put:
 *     summary: Update a city by ID
 *     tags: [Cities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: City ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       200:
 *         description: City updated successfully
 *       404:
 *         description: City not found
 *       500:
 *         description: Server error
 */
router.put("/cities/:id", verifyToken, updateCityById);

/**
 * @swagger
 * /cities/{id}:
 *   delete:
 *     summary: Delete a city by ID
 *     tags: [Cities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: City ID
 *     responses:
 *       200:
 *         description: City deleted successfully
 *       404:
 *         description: City not found
 *       500:
 *         description: Server error
 */
router.delete("/cities/:id", verifyToken, deleteCityById);
/////////////////////
// Restaurant Endpoints
/////////////////////

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurant management endpoints
 */

/////////////////////
// Restaurant Endpoints
/////////////////////

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurant management endpoints
 */

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       500:
 *         description: Server error
 */
router.post("/restaurants", verifyToken, createRestaurant);

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 *       500:
 *         description: Server error
 */
router.get("/restaurants", getAllRestaurants);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Get a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Server error
 */
router.get("/restaurants/:id", getRestaurantById);

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: Update a restaurant by ID
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Server error
 */
router.put("/restaurants/:id", verifyToken, updateRestaurantById);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant by ID
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Server error
 */
router.delete("/restaurants/:id", verifyToken, deleteRestaurantById);

export default router;
