const { GoogleGenAI } = require('@google/genai');

async function test() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  console.log('Requesting image from gemini-3.1-flash-image-preview...');
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: "A soft children's book illustration of a frog on a lily pad. Warm pastel colors.",
    config: { responseModalities: ['IMAGE', 'TEXT'] },
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));
  if (imagePart) {
    console.log('SUCCESS! Image mimeType:', imagePart.inlineData.mimeType, '| bytes:', imagePart.inlineData.data.length);
  } else {
    const textPart = parts.find(p => p.text);
    console.log('No image returned. Text parts:', textPart?.text || 'none');
    console.log('All parts:', JSON.stringify(parts.map(p => Object.keys(p))));
  }
}

test().catch(err => console.error('FAILED:', err.message));
