import { selectGraph } from "@controllers/main/abilityController";
import express from "express";

const abliltyRouter = express.Router();

abliltyRouter.post("/selectGraph", selectGraph);

export default abliltyRouter;