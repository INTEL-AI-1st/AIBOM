import express from "express";
import { selectA001, selectA002, selectProfile } from "@controllers/report/reportController";
import { getPrompt } from "@controllers/report/promptController";

const ReportRouter = express.Router();

ReportRouter.post("/selectProfile", selectProfile);
ReportRouter.post("/selectA001", selectA001);
ReportRouter.post("/selectA002", selectA002);

ReportRouter.post("/getPrompt", getPrompt);

export default ReportRouter;