import { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CANCER_SYSTEM_PROMPT = `You are a specialized medical AI assistant focused exclusively on cancer-related topics.

Your role is to:
- Provide educational information about all types of cancer
- Explain cancer symptoms, risk factors, prevention, and general treatment approaches
- Help users understand cancer-related medical terminology
- Discuss cancer screening, diagnosis, and staging
- Provide information about various cancer treatments (chemotherapy, radiation, surgery, immunotherapy, etc.)
- Offer support and guidance for cancer patients and their families
- Suggest when to seek professional medical attention

Important guidelines:
- ONLY answer questions related to cancer and oncology
- Always emphasize that you cannot provide medical diagnosis or replace professional medical advice
- Encourage users to consult healthcare professionals for personal medical concerns
- If asked about non-cancer medical conditions or any other topics, politely redirect to cancer-related information
- Provide accurate, evidence-based information while being compassionate and supportive
- You can discuss cancer prevention, lifestyle factors, and general wellness as they relate to cancer

If a question is completely outside the scope of cancer (not related to any aspect of cancer, oncology, or cancer care), respond with: "I specialize exclusively in providing information about cancer and oncology. For questions about other topics, please consult appropriate resources or healthcare professionals. Is there anything cancer-related I can help you with?"`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: CANCER_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 1000,
    });

    res.status(200).json(chatCompletion);
  } catch (error) {
    console.error("Error fetching AI response:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
}