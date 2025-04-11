import express from "express";
import cors from "cors";
import os from "os";
import fs from "fs";
import https from "https";
import path from 'path';

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
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const corsOptions = {
  origin: [
    FRONTEND_URL
  ],
  credentials: true, // 자격 증명 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// OPTIONS 요청에 대한 사전 처리
expressApp.options('*', cors(corsOptions));
expressApp.use(cors(corsOptions));
expressApp.use(express.json());

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
  for (const name in interfaces) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "unknown";
}

// HTTPS 옵션에 인증서와 개인키 파일 경로 설정 (경로는 파일이 저장된 위치에 맞게 조정)
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'keys', 'private.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'keys', 'public.pem')), 
};

// 로컬 개발 환경에서 HTTPS 서버 실행
if (process.env.NODE_ENV !== 'production') {
  const localIP = getLocalIP();
  
  // HTTPS 서버 생성
  https.createServer(httpsOptions, expressApp).listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 HTTPS Server running at:`);
    console.log(`👉 https://localhost:${PORT}`);
    console.log(`👉 https://${localIP}:${PORT}`);
  });
} else {
  // production 환경에서는 일반 HTTP 서버 실행 (또는 실제 인증서 사용한 HTTPS 서버 구성)
  expressApp.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}
