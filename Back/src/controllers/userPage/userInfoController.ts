import { selectInfo } from "@models/userPage/userInfoModel";
import { Request, Response } from "express";

export const selectUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user?.uid;
    const { seachUid } = req.body;
    
    const targetUid = seachUid || uid;
    const info = await selectInfo(targetUid);

    const isOwner = seachUid ? seachUid === uid : true;

    res.json({ info, isOwner });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};