import { getUid } from "@middlewares/authMiddleware";
import { deleteMyProfile, selectMyInfo, updateMyInfo, upsertMyProfile } from "@controllers/myPage/myInfoController";
import express from "express";

const myInfoRouter = express.Router();

myInfoRouter.post("/selectMyInfo", getUid, selectMyInfo);
myInfoRouter.post("/upsertMyProfile", getUid, upsertMyProfile);
myInfoRouter.post("/deleteMyProfile", getUid, deleteMyProfile);
myInfoRouter.post('/updateMyInfo', getUid, updateMyInfo);
// myInfoRouter.post("/toggleChange", getUid, toggleChange);
export default myInfoRouter;