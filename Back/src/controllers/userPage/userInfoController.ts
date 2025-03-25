import { selectInfo } from "@models/userPage/userInfoModel";
import { Request, Response } from "express";

export const selectUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const uuid = (req as any).user?.uuid;
    const { seachUuid } = req.body;
    
    const targetUuid = seachUuid || uuid;
    const info = await selectInfo(targetUuid);

    const isOwner = seachUuid ? seachUuid === uuid : true;

    res.json({ info, isOwner });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};