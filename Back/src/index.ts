import express from "express";
import cors from "cors";
import authRoutes from "@routes/auth/authRoutes";
import oauthRoutes from "@routes/auth/oauthRoutes";
import userInfoRoutes from "@routes/userPage/userInfoRoutes";
import myApiRoutes from "@routes/myPage/myApiRoutes";
import myInfoRoutes from "@routes/myPage/myInfoRoutes";
import characterCreateRoutes from "@routes/character/create/characterCreateRoutes";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Auth
app.use("/auth", authRoutes);
app.use("/oauth", oauthRoutes);
//MyPage
app.use("/userInfo", userInfoRoutes);
app.use("/myInfo", myInfoRoutes);
app.use("/myApi", myApiRoutes);

//character\create
app.use("/character/create", characterCreateRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
