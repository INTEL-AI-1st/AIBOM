import { getUid } from "@middlewares/authMiddleware";
import { deleteChild, deleteProfile, saveChild, selectChild, upsertProfile } from "@controllers/myPage/myChildController";
import express from "express";

const myChildRouter = express.Router();

myChildRouter.post("/selectChild", getUid, selectChild);
myChildRouter.post("/saveChild", getUid, saveChild);
myChildRouter.post("/deleteChild", deleteChild);
myChildRouter.post("/upsertProfile", upsertProfile);
myChildRouter.post("/deleteProfile", deleteProfile);

export default myChildRouter;