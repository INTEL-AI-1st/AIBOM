import express from "express";
import cors from "cors";
import os from "os"; // 추가

import authRoutes from "@routes/auth/authRoutes";
import oauthRoutes from "@routes/auth/oauthRoutes";
import userInfoRoutes from "@routes/userPage/userInfoRoutes";

import abilityRoutes from "@routes/main/abilityRoutes";

import myInfoRoutes from "@routes/myPage/myInfoRoutes";
import myChildRoutes from "@routes/myPage/myChildRoutes";

import observationRoutes from "@routes/measure/observationRoutes";
import behavioralRoutes from "@routes/measure/behavioralRoutes";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

//Auth
app.use("/auth", authRoutes);
app.use("/oauth", oauthRoutes);

//main
app.use("/ability", abilityRoutes)

//MyPage
app.use("/userInfo", userInfoRoutes);
app.use("/myInfo", myInfoRoutes);
app.use("/myChild", myChildRoutes);

app.use("/obser", observationRoutes);
app.use("/beha", behavioralRoutes);

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

const localIP = getLocalIP();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`👉 http://${localIP}:${PORT}`);
});
