import { PR_Observation } from './../../models/measure/observationModel';
import { selectChildObservation, upsertChildObservation } from "@models/measure/observationModel";
import { Request, Response } from "express";

export const selectObservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid } = req.body
    const info = await selectChildObservation(uid);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const upsertObservation = async (req: Request, res: Response): Promise<void> => {
  try {      
    const { uid, abilityLabelId, questId, score } = req.body; 
    const info = await upsertChildObservation(uid, abilityLabelId, questId, score);
    res.json({ info });
  } catch (error) {
    console.error("업로드 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const saveObservation = async (req: Request, res: Response): Promise<void> => {
  try {      
    const { uid } = req.body; 
    const info = await PR_Observation(uid);
    res.json({ info });
  } catch (error) {
    console.error("업로드 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};