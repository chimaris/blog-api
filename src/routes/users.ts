import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

/* GET users listing. */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	res.send("respond with a resource");
});

export default router;
