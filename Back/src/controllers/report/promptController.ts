// promptRoute.ts
import { Request, Response } from "express";
import OpenAI from "openai";
import env from "@config/config";
import { getCombinedPrompt } from "@assets/prompt";

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const getPrompt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { kicceReport, kdstReport } = req.body;
    
    const prompt = getCombinedPrompt(kicceReport, kdstReport);
    
    const response = await client.responses.create({
      model: "gpt-4",
      input: [
        { role: "system", content: "너는 유아 발달 분석 전문가이다." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });
    
    res.json({ text: response.output_text });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
