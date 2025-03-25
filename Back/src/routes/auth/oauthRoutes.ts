import express from "express";
import { appleLogin, googleLogin, kakaoLogin, naverLogin } from "@controllers/auth/oauthController";
import { appleCallBack, googleCallBack, kakaoCallBack, naverCallBack } from "@controllers/auth/oauthCallBackController";

const oauthRouter = express.Router();

oauthRouter.get("/naver", naverLogin);
oauthRouter.get("/kakao", kakaoLogin);
oauthRouter.get("/google", googleLogin);
oauthRouter.get("/apple", appleLogin);

oauthRouter.get("/naverCallBack", naverCallBack);
oauthRouter.get("/kakaoCallBack", kakaoCallBack);
oauthRouter.get("/googleCallBack", googleCallBack);
oauthRouter.get("/appleCallBack", appleCallBack);

export default oauthRouter;
