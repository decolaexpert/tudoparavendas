import { GoogleGenAI } from "@google/genai";

// Modelo de geração/edição de imagem do Google (codinome "Nano Banana").
// Forte em preservar fidelidade do objeto original ao recompor a cena —
// é exatamente essa característica que sustenta a promessa do Photo Studio
// TPV: "sem alterar a peça, 100% fiel".
const MODEL_ID = "gemini-2.5-flash-image";

let client: GoogleGenAI | null = null;

function getClient() {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }
  return client;
}

interface GenerateJewelryPhotoParams {
  prompt: string;
  imageBase64: string;
  mimeType: string;
}

interface GenerateJewelryPhotoResult {
  imageBase64: string;
  mimeType: string;
}

/**
 * Envia o prompt mestre da referência escolhida + a foto da peça real da
 * cliente para o Gemini, e devolve a imagem gerada em base64.
 */
export async function generateJewelryPhoto({
  prompt,
  imageBase64,
  mimeType,
}: GenerateJewelryPhotoParams): Promise<GenerateJewelryPhotoResult> {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: MODEL_ID,
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: imageBase64 } },
        ],
      },
    ],
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((part) => part.inlineData);

  if (!imagePart?.inlineData) {
    throw new Error("O Gemini não retornou uma imagem para este prompt.");
  }

  return {
    imageBase64: imagePart.inlineData.data!,
    mimeType: imagePart.inlineData.mimeType ?? "image/png",
  };
}
