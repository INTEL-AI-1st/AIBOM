import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "@config/config";
import { findUserByEmail, createUser, loginUser, authUser, findUserByNickName, getMyUser } from "@models/auth/authModel";

const JWT_SECRET = env.JWT_SECRET || "default_secret";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, nickName, birthday, pw, agent } = req.body;   

    const isEmail = await findUserByEmail(email);
    if (isEmail) {
      res.status(400).json({ message: "사용 중인 이메일입니다." });
      return;
    }

    const isNickName = await findUserByNickName(nickName);
    if (isNickName) {
      res.status(400).json({ message: "사용 중인 닉네임입니다." });
      return;
    }

    await createUser(name, email, nickName, birthday, agent, pw);

    res.status(201).json({ message: "회원가입 성공" });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, pw } = req.body;

    const user = await loginUser(email, pw);
    if (!user) {
      res.status(400).json({ message: "존재하지 않는 계정입니다." });
      return;
    }
    const uid = user.uid;
    const token = jwt.sign({ uid: uid }, JWT_SECRET, { expiresIn: "1h" });
    // await authUser(uid, token); //운영일 때 주석해제
    res.json({ token });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};

export const auth = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "정상 토큰" });
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userUid = (req as any).user?.uid;
    const { uid } = req.body;
    const targetUid = uid || userUid;
    
    const info = await getMyUser(targetUid);
    res.json({ info });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
}