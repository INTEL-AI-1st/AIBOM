import axios from 'axios';
import env from "@config/config";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { CALL_BACK_URL } from './oauthController';
import { authUser, createUser, findUserByEmail } from '@models/auth/authModel';

interface UserProfile {
    email: string;
    name: string;
}
const JWT_SECRET = env.JWT_SECRET || 'none';

/**
 * 네이버 콜백
 */
export const naverCallBack = async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code;
  const state = req.query.state;
  const agent = 'naver';

  const clientId = env.NAVER_CLIENT_ID;
  const clientSecret = env.NAVER_CLIENT_SECRET;
  const redirectUri = `${CALL_BACK_URL}/naverCallBack`;

  try {
    // 액세스 토큰 요청
    const tokenResponse = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        state,
        redirect_uri: redirectUri,
      },
    });

    const { access_token } = tokenResponse.data;

    // 사용자 프로필 정보 요청
    const profileResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  
    const profileData = profileResponse.data;
    await oauthLogin(profileData, agent, res);
  } catch (error) {
    console.error('Error fetching access token:', error);
    res.status(500).send('Error fetching access token');
  }
};

/**
 * 카카오 콜백
 */
export const kakaoCallBack = async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code as string;
    const agent = 'kakao';
  
    const clientId = env.KAKAO_CLIENT_ID;
    const clientSecret = env.KAKAO_CLIENT_SECRET;
    const redirectUri = `${CALL_BACK_URL}/kakaoCallBack`;
  
    try {
      // 액세스 토큰 요청
      const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code,
        },
      });
  
      const { access_token } = tokenResponse.data;
  
      // 사용자 프로필 정보 요청
      const profileResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
  
      const profileData = profileResponse.data;
  
      await oauthLogin(profileData, agent, res);
    } catch (error) {
      console.error('Error during Kakao OAuth process:', error);
      res.status(500).send('Error during Kakao OAuth process');
    }
  };
/**
 * 구글 콜백
 */
export const googleCallBack = async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code;
    const agent = 'google';
  
    const clientId = env.GOOGLE_CLIENT_ID;
    const clientSecret = env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${CALL_BACK_URL}/googleCallBack`;
  
    try {
      // 액세스 토큰 요청
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
        params: {
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        },
      });
  
      const { access_token } = tokenResponse.data;
  
      // 사용자 프로필 정보 요청
      const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
  
      const profileData = profileResponse.data;
  
      await oauthLogin(profileData, agent, res);
    } catch (error) {
      console.error('Error during Google OAuth process:', error);
      res.status(500).send('Error during Google OAuth process');
    }
  };

  /**
 * 애플 콜백
 */
export const appleCallBack = async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code;
    const state = req.query.state;
    const agent = 'apple';
  
    const clientId = env.NAVER_CLIENT_ID;
    const clientSecret = env.NAVER_CLIENT_SECRET;
    const redirectUri = 'http://localhost:5000/oauth/kakaoCallBack';
  };

/** 
 * 데이터 저장 및 로그인
*/
const oauthLogin = async (profileData: any, agent: string, res: Response): Promise<void> => {
  try {
    const { email, name } = extractUserProfile(profileData, agent);
    // 기존 유저 조회
    let existingUser = await findUserByEmail(email);
    if (!existingUser) {
      res.cookie('regiData', JSON.stringify({ email, name, agent }), {
        secure: true,
        sameSite: 'strict'
      });
      res.redirect(env.FRONTEND_URL + '/register?status=success');
      return;
    }
    
    const uuid = existingUser.uuid;
    const token = jwt.sign({ uuid: uuid }, JWT_SECRET, { expiresIn: "1h" });
    await authUser(uuid, token);

    res.cookie('authToken', token, { secure: true, sameSite: 'strict' });
    res.redirect(env.FRONTEND_URL+'/oauth-result?status=success');
  } catch (error) {
    console.error('Error during user login:', error);
    res.redirect(env.FRONTEND_URL+'/oauth-result?status=fail');
  }
};

/** 
 * agent에 맞는 데이터 전처리
*/
const extractUserProfile = (profileData: any, agent: string): UserProfile => {
    switch (agent) {
      case 'google':
        return {
          email: profileData.email,
          name: profileData.name,
        };
      case 'naver':
        return {
          email: profileData.response.email,
          name: profileData.response.name,
        };
      case 'kakao':
        return {
          email: profileData.kakao_account.email,
          name: profileData.properties.nickname,
        };
      case 'apple':
        return {
          email: profileData.email,
          name: profileData.name,
        };
      default:
        throw new Error(`Unsupported agent: ${agent}`);
    }
  };