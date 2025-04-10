  import { Request, Response } from "express";
import OpenAI from "openai";
import env from "@config/config";
import { getChatBotPrompt } from "@assets/prompt";

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const getMsg = async (req: Request, res: Response): Promise<void> => {
  try {
    const { msg } = req.body;

    const chatPrompt = getChatBotPrompt(msg);

    const chatResponse = await client.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "system",
          content: "당신은 유아 발달 질문 대답용 챗봇입니다.",
        },
        { role: "user", content: chatPrompt },
      ],
      temperature: 0.7,
    });

    res.json({ text: chatResponse.output_text });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};