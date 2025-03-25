import { selectLst } from "@models/character/create/characterCreateModel";
import { Request, Response } from "express";


export const getLst = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cls } = req.body;
    const uuid = (req as any).user?.uuid;
    const lst = await selectLst(cls, uuid);

    res.json({ lst });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};