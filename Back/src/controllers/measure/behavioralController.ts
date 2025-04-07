import { selectAbility } from "@models/measure/behavioralModel";
import { Request, Response } from "express";

export const selectAbilites = async (req: Request, res: Response): Promise<void> => {
  try {
    const { month } = req.body
    const info = await selectAbility(month);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};