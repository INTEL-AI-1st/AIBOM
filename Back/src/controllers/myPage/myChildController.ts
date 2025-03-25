import { saveMyChild, selectMyChild } from "@models/myPage/myChildModel";
import { Request, Response } from "express";

export const selectChild = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user?.uid;
    const info = await selectMyChild(uid);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const saveChild = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user?.uid;
    const { child } = req.body;  
    console.log(child);
    const info = await saveMyChild(uid, child);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};