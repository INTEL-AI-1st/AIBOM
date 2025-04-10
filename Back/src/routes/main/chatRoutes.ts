import { getMsg } from "@controllers/main/chatController";
import express from "express";

const chatRouter = express.Router();

chatRouter.post("/getMsg", getMsg);

export default chatRouter;