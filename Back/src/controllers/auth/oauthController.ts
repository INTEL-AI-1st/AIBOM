import env from "@config/config";
import { randomBytes } from "crypto";
import { Request, Response } from "express";

export const CALL_BACK_URL = `${env.VITE_BACKEND_URL}/oauth`;

/**
 * 임의의 문자열(랜덤 state) 생성 함수
 * (참고: 이 방법은 간단한 예시이며, 보안용으로는 crypto API 사용을 권장)
 */
function generateRandomState(length: number = 16): string {
  const bytes = randomBytes(length);
  return bytes.toString('base64').substring(0, length);
}

/**
 * 네이버 로그인: 네이버 OAuth2.0 URL로 리다이렉트
 */
export const naverLogin = async (req: Request, res: Response): Promise<void> => {
  const clientId = env.NAVER_CLIENT_ID;
  const callbackUrl = `${CALL_BACK_URL}/naverCallBack`;
  const state = generateRandomState();
  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&state=${state}&redirect_uri=${encodeURIComponent(callbackUrl)}`;

  res.redirect(naverAuthUrl);
};

/**
 * 카카오 로그인: 카카오 OAuth2.0 URL로 리다이렉트
 */
export const kakaoLogin = async (req: Request, res: Response): Promise<void> => {
  const clientId = env.KAKAO_KEY;
  const redirectUri = `${CALL_BACK_URL}/kakaoCallBack`;
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code`;
  res.redirect(kakaoAuthUrl);
}

/**
 * 구글 로그인: 구글 OAuth2.0 URL로 리다이렉트
 */
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  const clientId = env.GOOGLE_CLIENT_ID;
  const redirectUri = `${CALL_BACK_URL}/googleCallBack`;
  const scope = "email profile";
  const state = generateRandomState();
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&state=${state}`;
  res.redirect(googleAuthUrl);
}

/**
 * 애플 로그인: 애플 OAuth2.0 URL로 리다이렉트
 */
export const appleLogin = async (req: Request, res: Response): Promise<void> => {
  const clientId = env.APPLE_CLIENT_ID as string;
  const redirectUri =
    env.APPLE_REDIRECT_URI ||
    "http://localhost:5173/oauth/apple";
  const state = generateRandomState();
  const scope = "name email";
  const responseType = "code id_token";
  const responseMode = "form_post";
  const appleAuthUrl = `https://appleid.apple.com/auth/authorize?response_type=${encodeURIComponent(
    responseType
  )}&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${encodeURIComponent(scope)}&response_mode=${responseMode}`;
  res.redirect(appleAuthUrl);
}