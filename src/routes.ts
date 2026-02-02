import { Router, Request, Response } from "express";
const router: Router = Router();

router.get("/api", (req: Request, res: Response) => {
  res.status(200).send("API is working");
});

export default router;
