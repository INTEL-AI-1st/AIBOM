import { selectA001Data, selectA002Data, selectChildProfile } from "@models/report/ReportModel";
import { Request, Response } from "express";

export const selectProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid } = req.body
    const info = await selectChildProfile(uid);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const selectA001 = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, month } = req.body
    const info = await selectA001Data(uid, month);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const selectA002 = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, age } = req.body
    const info = await selectA002Data(uid, age);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};