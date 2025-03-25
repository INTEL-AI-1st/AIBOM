import { deleteProfile, selectInfo, updateInfo, upsertProfile } from "@models/myPage/myInfoModel";
import { Request, Response } from "express";

export const selectMyInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const uuid = (req as any).user?.uuid;
    const info = await selectInfo(uuid);
    console.log(uuid);
    console.log(info);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const upsertMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const uuid = (req as any).user?.uuid;
    const { profile } = req.body;  
    const info = await upsertProfile(uuid, profile);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const deleteMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const uuid = (req as any).user?.uuid;
    const info = await deleteProfile(uuid);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const updateMyInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isPw, pw, nickName, bio } = req.body;   
    const uuid = (req as any).user?.uuid;

    await updateInfo(uuid, isPw, pw, nickName, bio);

    res.status(201).json({ message: "저장 성공" });
  } catch (error) {
    console.error("저장 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};