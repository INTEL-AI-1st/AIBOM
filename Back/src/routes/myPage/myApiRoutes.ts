import { createMyAPI, selectMyAPI, toggleChange } from "@controllers/myPage/myApiController";
import { getUuid } from "@middlewares/authMiddleware";
import express from "express";

const myApiRouter = express.Router();

myApiRouter.post("/selectAPI", getUuid, selectMyAPI);
myApiRouter.post('/createAPI', getUuid, createMyAPI);
myApiRouter.post("/toggleChange", getUuid, toggleChange);
export default myApiRouter;
