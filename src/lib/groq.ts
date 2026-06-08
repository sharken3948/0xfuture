import Groq from 'groq-sdk';

let client: Groq | null = null;

export function getGroqClient(): Groq {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}

export async function generateReading(prompt: string, language = 'English'): Promise<string> {
  const groq = getGroqClient();
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content:
          `You are 0xFUTURE, a mystical AI oracle for the onchain world. You blend ancient wisdom with crypto culture. Keep readings concise (150–200 words), evocative, and specific to the data provided. Use second person. No disclaimers. Respond in ${language}. Never use hyphens, em dashes, or en dashes in your response. Use commas or rewrite the phrase instead.`,
      },
      { role: 'user', content: prompt },
    ],
    max_tokens: 350,
    temperature: 0.85,
  });
  return completion.choices[0]?.message?.content ?? 'The oracle is silent. Try again.';
}
