import { Router, Request, Response } from "express";
import {
  createCity,
  getAllCities,
  getCityById,
  updateCityById,
  deleteCityById,
} from "./controllers/cityController";
import { loginUser, registerUser } from "./controllers/authController";
import { verifyToken } from "./middleware/verifyToken";
const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("API is working");
});

//Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
// City routes
router.post("/cities", verifyToken, createCity);
router.get("/cities", getAllCities);
router.get("/cities/:id", getCityById);
router.put("/cities/:id", verifyToken, updateCityById);
router.delete("/cities/:id", verifyToken, deleteCityById);
export default router;
