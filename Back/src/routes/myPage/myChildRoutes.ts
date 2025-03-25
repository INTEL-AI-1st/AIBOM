import { getUid } from "@middlewares/authMiddleware";
import { saveChild, selectChild } from "@controllers/myPage/myChildController";
import express from "express";

const myChildRouter = express.Router();

myChildRouter.post("/selectChild", getUid, selectChild);
myChildRouter.post("/saveChild", getUid, saveChild);

export default myChildRouter;