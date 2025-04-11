import express from "express";
import cors from "cors";
import os from "os";
import fs from "fs";
import https from "https";
import path from "path";

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

// 포트 설정: Cloud Run 배포 시에는 process.env.PORT가 자동 설정되고, 로컬에서는 process.env.DEV_PORT 또는 기본값(5000)을 사용합니다.
const PORT = Number(process.env.PORT || process.env.DEV_PORT || 5000);

// 환경 변수 FRONTEND_URL이 없다면 기본값 설정 (로컬 개발용)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const corsOptions = {
  origin: [FRONTEND_URL],
  credentials: true, // 자격 증명 허용
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

expressApp.options("*", cors(corsOptions));
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

// ▶ 로컬 IP를 구하는 함수 (로컬 디버깅용)
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

// 로컬 개발을 위한 HTTPS 옵션 (인증서 경로는 환경에 맞게 조정)
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "keys", "private.pem")),
  cert: fs.readFileSync(path.join(__dirname, "keys", "public.pem")),
};

// Cloud Run 등 PORT 환경 변수가 존재하는 경우에는 HTTP 서버를 실행하도록 합니다.
// 이때 반드시 0.0.0.0으로 바인딩해서 모든 네트워크 인터페이스에서 요청을 수신하도록 합니다.
if (process.env.PORT) {
  // 배포 환경 (Cloud Run)
  expressApp.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
  });
} else {
  // 로컬 개발 환경: HTTPS 서버 실행
  const localIP = getLocalIP();
  https.createServer(httpsOptions, expressApp).listen(PORT, "0.0.0.0", () => {
    console.log("🚀 HTTPS Server running at:");
    console.log(`👉 https://localhost:${PORT}`);
    console.log(`👉 https://${localIP}:${PORT}`);
  });
}
