import dotenv from "dotenv";
import path from "path";

// 환경 변수 로드
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export default process.env;
