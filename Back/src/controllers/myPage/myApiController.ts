import { createAPI, selectAPI, updateToggle } from "@models/myPage/myApiModel";
import { Request, Response } from "express";


export const selectMyAPI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ai } = req.body; 
    const uuid = (req as any).user?.uuid;
    const api = await selectAPI(uuid , ai);

    res.json({ api });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const createMyAPI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ai, apiKey } = req.body;   
    const uuid = (req as any).user?.uuid;

    await createAPI(uuid, ai, apiKey);

    res.status(201).json({ message: "저장 성공" });
  } catch (error) {
    console.error("저장 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const toggleChange = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ai } = req.body; 
    const uuid = (req as any).user?.uuid;
   
    await updateToggle(uuid , ai);

  } catch (error) {
    console.error("토클 업데이트 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};