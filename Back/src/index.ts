import express from "express";
import cors from "cors";
import os from "os";
import * as functions from 'firebase-functions';

import authRoutes from "@routes/auth/authRoutes";
import oauthRoutes from "@routes/auth/oauthRoutes";
import userInfoRoutes from "@routes/userPage/userInfoRoutes";

import abilityRoutes from "@routes/main/abilityRoutes";
import chatRoutes from "@routes/main/chatRoutes";

import myInfoRoutes from "@routes/myPage/myInfoRoutes";
import myChildRoutes from "@routes/myPage/myChildRoutes";

import observationRoutes from "@routes/measure/observationRoutes";
import behavioralRoutes from "@routes/measure/behavioralRoutes";

import reportRoutes from "@routes/report/reportRoutes";

const expressApp = express();
const PORT = Number(process.env.PORT) || 5000;

// 환경 변수 FRONTEND_URL이 없다면 기본값 설정 (필요 시)
const FRONTEND_URL = process.env.FRONTEND_URL || "https://aibom.web.app";

const corsOptions = {
  origin: [
    'https://aibom.web.app', 
    FRONTEND_URL, 
    'http://localhost:5173' // 개발환경도 추가
  ],
  credentials: true, // 자격 증명 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// OPTIONS 요청에 대한 사전 처리
expressApp.options('*', cors(corsOptions));
expressApp.use(cors(corsOptions));
expressApp.use(express.json());

// CORS 커스텀 미들웨어 제거 - cors 라이브러리가 이미 처리하고 있음

// Auth Routes
expressApp.use("/auth", authRoutes);
expressApp.use("/oauth", oauthRoutes);

// Main Routes
expressApp.use("/ability", abilityRoutes);
expressApp.use("/chat", chatRoutes);

// MyPage Routes
expressApp.use("/userInfo", userInfoRoutes);
expressApp.use("/myInfo", myInfoRoutes);
expressApp.use("/myChild", myChildRoutes);

// Measure Routes
expressApp.use("/obser", observationRoutes);
expressApp.use("/beha", behavioralRoutes);

// Report Routes
expressApp.use("/report", reportRoutes);

expressApp.get("/", (req, res) => {
  res.send("Backend is running.");
});

expressApp.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ▶ 로컬 IP 구하는 함수
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]!) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "unknown";
}

// 로컬 개발 환경에서만 실행
if (process.env.NODE_ENV !== 'production') {
  const localIP = getLocalIP();
  expressApp.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running at:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`👉 http://${localIP}:${PORT}`);
  });
}

// Firebase Functions용 익스포트
export const app = functions.https.onRequest(expressApp);