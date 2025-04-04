import { selectChildGraph } from "@models/main/abilityModel";
import { Request, Response } from "express";

export const selectGraph = async (req: Request, res: Response): Promise<void> => {
  try {

    const { uid, age } = req.body;
    const info = await selectChildGraph(uid, age);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};