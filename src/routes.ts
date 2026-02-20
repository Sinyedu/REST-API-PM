import { Router, Request, Response } from "express";
import { createCity, getAllCities } from "./controllers/cityController";
const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("API is working");
});

router.post("/cities", createCity);
router.get("/cities", getAllCities);
export default router;
