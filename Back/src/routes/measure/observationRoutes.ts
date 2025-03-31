import express from "express";
import { saveObservation, selectObservation, upsertObservation } from "@controllers/measure/observationController";

const ObservationRouter = express.Router();

ObservationRouter.post("/selectObservation", selectObservation);
ObservationRouter.post("/upsertObservation", upsertObservation);
ObservationRouter.post("/saveObservation", saveObservation);

export default ObservationRouter;