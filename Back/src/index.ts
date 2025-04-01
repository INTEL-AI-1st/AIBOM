import express from "express";
import cors from "cors";
import authRoutes from "@routes/auth/authRoutes";
import oauthRoutes from "@routes/auth/oauthRoutes";
import userInfoRoutes from "@routes/userPage/userInfoRoutes";

import abilityRoutes from "@routes/main/abilityRoutes";

import myInfoRoutes from "@routes/myPage/myInfoRoutes";
import myChildRoutes from "@routes/myPage/myChildRoutes";

import observationRoutes from "@routes/measure/observationRoutes";
import behavioralRoutes from "@routes/measure/behavioralRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
