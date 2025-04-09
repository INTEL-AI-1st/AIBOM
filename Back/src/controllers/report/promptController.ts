  import { Request, Response } from "express";
import OpenAI from "openai";
import env from "@config/config";
import { getCombinedPrompt, getKdstPrompt, getKiccePrompt } from "@assets/prompt";

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const getPrompt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { kicceReport, kdstReport, payload } = req.body;

    console.log("전체 payload:", JSON.stringify(payload, null, 2));

    // 프로필 정보를 통해 나이와 성별을 추출
    const name = payload.context.profile.name;
    const age = payload.context.profile.ageMonths;
    const gender = payload.context.profile.gender;

    // 여러 평가 결과 응답을 모으기 위한 배열
    const responses: { type: string; text: string }[] = [];

    // a001이 존재할 경우: K-DST 평가 프롬프트 생성 및 호출
    if (payload.context.a001) {
      console.log("a001 데이터:", JSON.stringify(payload.context.a001, null, 2));

      const a001Data: any[] = payload.context.a001;
      const sectionTextA001 = a001Data
        .map((item) => {
          // 실제 데이터 구조에 맞게 필드명(item.label, item.score 등)을 수정하세요.
          return `항목: ${item.info}, 점수: ${item.score}`;
        })
        .join("\n");

      const groupNameA001 = "행동 평가";
      const promptA001 = getKdstPrompt(name, age, gender, groupNameA001, sectionTextA001);
      console.log("최종 K-DST 프롬프트:", promptA001);

      const kdstResponse = await client.responses.create({
        model: "gpt-4o",
        input: [
          {
            role: "system",
            content: "너는 유아 행동 발달 분석 전문가이자 교육 컨설턴트입니다.",
          },
          { role: "user", content: promptA001 },
        ],
        temperature: 0.7,
      });
      responses.push({ type: "K-DST", text: kdstResponse.output_text });
      console.log(`kdstResponse   ===== ${kdstResponse.output_text}`);
    }


    // a002가 존재할 경우: KICCE 평가 프롬프트 생성 및 호출
    if (payload.context.a002) {
      console.log("a002 데이터:", JSON.stringify(payload.context.a002, null, 2));
      // 예시: { "신체운동": 85, "의사소통": 90, "사회관계": 80, "예술경험": 75, "자연탐구": 88 }
      const a002Data: any[] = payload.context.a002;

      const sectionTextA002 = a002Data
        .map((item) => {
          return `${item.domain}: { 점수: ${item.score}, 나잇대 평균: ${item.avg} }`;
        })
        .join("\n");

      const promptA002 = getKiccePrompt(name,age, gender, sectionTextA002);
      console.log("최종 KICCE 프롬프트:", promptA002);

      const kicceResponse = await client.responses.create({
        model: "gpt-4o",
        input: [
          {
            role: "system",
            content: "너는 유아 행동 발달 분석 전문가이자 교육 컨설턴트이다.",
          },
          { role: "user", content: promptA002 },
        ],
        temperature: 0.7,
      });
      responses.push({ type: "KICCE", text: kicceResponse.output_text });
    }

      const combinedPrompt = getCombinedPrompt(kicceReport, kdstReport);
      console.log("최종 Combined 프롬프트:", combinedPrompt);

      const combinedResponse = await client.responses.create({
        model: "gpt-4o",
        input: [
          {
            role: "system",
            content: "너는 유아 발달 분석 전문가입니다.",
          },
          { role: "user", content: combinedPrompt },
        ],
        temperature: 0.7,
      });
      responses.push({ type: "Combined", text: combinedResponse.output_text });

    res.json({ responses });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};