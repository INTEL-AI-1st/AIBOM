import { getLst } from "@controllers/character/create/characterCreateController";
import { authenticateJWT } from "@middlewares/authMiddleware";
import express from "express";

const characterCreateRouter = express.Router();

characterCreateRouter.post("/getLst", authenticateJWT, getLst);

export default characterCreateRouter;
