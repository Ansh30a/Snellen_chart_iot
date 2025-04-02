// backend/routes/testRoutes.js
import express from "express";
import { fetchResults, fetchResultById } from "../controllers/testController.js";

const router = express.Router();

router.get("/results", fetchResults);
router.get("/results/:id", fetchResultById);

export default router;