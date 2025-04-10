  import { Request, Response } from "express";
import OpenAI from "openai";
import env from "@config/config";
import { getCombinedPrompt, getDevelopmentTipsPrompt, getExpertReviewPrompt, getKdstPrompt, getKiccePrompt } from "@assets/prompt";

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const getPrompt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { kicceReport, kdstReport, payload } = req.body;

    let kdst = '';
    let kicce = '';

    // 프로필 정보를 통해 나이와 성별을 추출
    const name = payload.context.profile.name;
    const age = payload.context.profile.ageMonths;
    const gender = payload.context.profile.gender;

    // 여러 평가 결과 응답을 모으기 위한 배열
    const responses: { type: string; text: string }[] = [];
    
    const a001Data: any[] = payload.context.a001;
    const a002Data: any[] = payload.context.a002;
    // a001이 존재할 경우: K-DST 평가 프롬프트 생성 및 호출
    if (payload.context.a001) {

      const sectionTextA001 = a001Data
        .map((item) => {
          // 실제 데이터 구조에 맞게 필드명(item.label, item.score 등)을 수정하세요.
          return `항목: ${item.info}, 점수: ${item.score}`;
        })
        .join("\n");

      const groupNameA001 = "행동 평가";
      const promptA001 = getKdstPrompt(name, age, gender, groupNameA001, sectionTextA001);

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
      
      kdst = kdstReport ? kdstReport : kdstResponse.output_text;
      responses.push({ type: "K-DST", text: kdstResponse.output_text });
    }


    // a002가 존재할 경우: KICCE 평가 프롬프트 생성 및 호출
    if (payload.context.a002) {
      const sectionTextA002 = a002Data
        .map((item) => {
          return `${item.domain}: { 점수: ${item.score}, 나잇대 평균: ${item.avg} }`;
        })
        .join("\n");

      const promptA002 = getKiccePrompt(name,age, gender, sectionTextA002);

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
      kicce = kicceReport ? kicceReport : kicceResponse.output_text;
      responses.push({ type: "KICCE", text: kicceResponse.output_text });
    }

    //전문가 총평
    let compairText = ''
    if (payload.context.a002) {
      compairText = a002Data
      .map((item) => {
        return `${item.domain}: { 저번 달 점수: ${item.prevSco}, 이번 달 점수: ${item.score}, 나잇대 평균: ${item.avg} }`;
      })
      .join("\n");
    }

    const reviewPrompt = getExpertReviewPrompt(name, kdst, compairText);
    const reviewResponse = await client.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "system",
          content: "너는 유아 발달 분석 전문가입니다.",
        },
        { role: "user", content: reviewPrompt },
      ],
      temperature: 0.7,
    });
    responses.push({ type: "review", text: reviewResponse.output_text });


    //발달 지원
    let tips = '';
    if(payload.context.a001 && payload.context.a002){
      const TipsPrompt = getDevelopmentTipsPrompt(name, age, gender, reviewResponse.output_text);
      const tipsResponse = await client.responses.create({
        model: "gpt-4o",
        input: [
          {
            role: "system",
            content: "너는 유아 발달 분석 전문가입니다.",
          },
          { role: "user", content: TipsPrompt },
        ],
        temperature: 0.7,
      });
      responses.push({ type: "tips", text: tipsResponse.output_text });
      tips = tipsResponse.output_text;
    }
    
    
    //종합 평가
    const combinedPrompt = getCombinedPrompt(kdst, kicce, tips);

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