import { deleteProfile, selectInfo, updateInfo, upsertProfile } from "@models/myPage/myInfoModel";
import { Request, Response } from "express";

export const selectMyInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user?.uid;
    const info = await selectInfo(uid);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const upsertMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user?.uid;
    const { profile } = req.body;  
    const info = await upsertProfile(uid, profile);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const deleteMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = (req as any).user?.uid;
    const info = await deleteProfile(uid);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const updateMyInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isPw, pw, nickName, bio } = req.body;   
    const uid = (req as any).user?.uid;

    await updateInfo(uid, isPw, pw, nickName, bio);

    res.status(201).json({ message: "저장 성공" });
  } catch (error) {
    console.error("저장 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};