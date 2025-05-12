import { Request, Response } from "express";
import env from "@config/config";
import { getChatBotPrompt } from "@assets/prompt";

import OpenAI from "openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB);
}
class SimpleRetriever {
  private docs: Document[];
  private vectors: number[][];
  private k: number;
  private embeddingModel: OpenAIEmbeddings;

  constructor(docs: Document[], vectors: number[][], k: number) {
    this.docs = docs;
    this.vectors = vectors;
    this.k = k;
    this.embeddingModel = new OpenAIEmbeddings({ openAIApiKey: env.OPENAI_API_KEY });
  }

  async getRelevantDocuments(query: string): Promise<Document[]> {
    const [qVec] = await this.embeddingModel.embedDocuments([query]);
    const scored = this.vectors
      .map((vec, idx) => ({ sim: cosineSimilarity(qVec, vec), idx }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, this.k);
    return scored.map(({ idx }) => this.docs[idx]);
  }
}

////////////////////////////////////////////////////////////////////////////////
// 1) Initialization: load PDFs, split, embed, build retriever
////////////////////////////////////////////////////////////////////////////////

let retriever: SimpleRetriever;

async function initRetriever() {
  // Paths to three PDFs
  const pdfPaths = [
    "src/controllers/main/data/KICCE.pdf",
    "src/controllers/main/data/K-DST.pdf",
    // "src/controllers/main/data/1.pdf"
  ];

  // Load and merge documents
  const rawArrays = await Promise.all(
    pdfPaths.map((p) => new PDFLoader(p).load())
  );
  const rawDocs = rawArrays.flat();

  // Split into chunks
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
  const chunks = await splitter.splitDocuments(rawDocs);

  // Embed chunks
  const embedModel = new OpenAIEmbeddings({ openAIApiKey: env.OPENAI_API_KEY });
  const vectors = await embedModel.embedDocuments(chunks.map((c) => c.pageContent));

  // Create retriever for top 4
  retriever = new SimpleRetriever(chunks, vectors, 4);
}

// Initialize on startup
initRetriever()
  .then(() => console.log("Retriever initialized"))
  .catch((e) => console.error("Failed to init retriever", e));

////////////////////////////////////////////////////////////////////////////////
// 2) Express handler: getMsg
////////////////////////////////////////////////////////////////////////////////

export const getMsg = async (req: Request, res: Response): Promise<void> => {
  try {
    const { msg } = req.body;
    const userPrompt = getChatBotPrompt(msg);

    // Retrieve relevant chunks
    const sources = await retriever.getRelevantDocuments(userPrompt);
    const context = sources.map((d) => d.pageContent).join("\n\n");
    console.log(retriever);
    console.log(context);
    // Call OpenAI chat completion
    const completion = await client.responses.create({
      model: "gpt-4o",
      input: [{ role: "system", content: "당신은 챗봇입니다." }, 
              { role: "system", content: `다음 문서를 참조하여 답변해 주세요:\n${context}` },
              { role: "user", content: userPrompt }
            ],
      temperature: 0.7,
    });

    const answer = completion.output_text;
    res.json({ text: answer, sources });
  } catch (error) {
    console.error("RAG error:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};
