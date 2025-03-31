import { deleteChildProfile, deleteMyChild, PR_MyChild, selectMyChild, upsertChildProfile } from "@models/myPage/myChildModel";
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
    const info = await PR_MyChild(uid, child.info);
    res.json({ info });
  } catch (error) {
    console.error("저장 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const deleteChild = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid } = req.body;  
    const info = await deleteMyChild(uid);
    res.json({ info });
  } catch (error) {
    console.error("삭제 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const upsertProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, fileName } = req.body; 
    const info = await upsertChildProfile(uid, fileName);
    res.json({ info });
  } catch (error) {
    console.error("업로드 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid } = req.body; 
    const info = await deleteChildProfile(uid);
    res.json({ info });
  } catch (error) {
    console.error("프로필삭제 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};