import { insertBehavioral, selectAbility } from "@models/measure/behavioralModel";
import { Request, Response } from "express";

export const selectAbilites = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, month } = req.body
    const info = await selectAbility(uid, month);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const insertBeha = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, abilityLabelId } = req.body
    console.log(abilityLabelId);
    const info = await insertBehavioral(uid, abilityLabelId);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};