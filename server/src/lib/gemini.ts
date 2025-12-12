import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const HTML_SYSTEM_PROMPT = `You are an expert UI/UX designer and frontend developer. Your task is to generate beautiful, modern HTML mockups based on user descriptions.

RULES:
1. Generate ONLY valid HTML code - no markdown, no code fences, no explanations
2. Use Tailwind CSS via CDN for styling (include the script tag)
3. Create visually appealing, modern designs with proper spacing, colors, and typography
4. Make the UI responsive and professional-looking
5. Include realistic placeholder content (not lorem ipsum)
6. Use a cohesive color scheme with subtle gradients and shadows
7. The HTML should be complete and self-contained (can be rendered in an iframe)
8. Start with <!DOCTYPE html> and include all necessary tags

STYLE GUIDELINES:
- Use modern, clean design principles
- Prefer subtle shadows and rounded corners
- Use a professional color palette (blues, grays, with accent colors)
- Include appropriate icons using Lucide or Heroicons CDN if needed
- Make text readable with proper contrast
- Add hover states and visual feedback where appropriate`;

export async function generateHtml(
  prompt: string,
  baseHtml?: string,
  variants: 1 | 4 = 1
): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const results: string[] = [];

  const contextPrompt = baseHtml
    ? `Based on this existing HTML:\n\n${baseHtml}\n\nUser request: ${prompt}`
    : prompt;

  for (let i = 0; i < variants; i++) {
    const variantPrompt =
      variants > 1
        ? `${contextPrompt}\n\nThis is variant ${
            i + 1
          } of ${variants}. Create a unique design variation while maintaining the core functionality.`
        : contextPrompt;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: variantPrompt }] }],
      systemInstruction: HTML_SYSTEM_PROMPT,
    });

    let html = result.response.text();

    // Clean up any markdown code fences if present
    html = html.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "");
    html = html.trim();

    results.push(html);
  }

  return results;
}

export async function editHtml(
  currentHtml: string,
  instruction: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const editPrompt = `Here is the current HTML:

${currentHtml}

Please modify this HTML according to the following instruction: ${instruction}

Return ONLY the modified HTML code, nothing else.`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: editPrompt }] }],
    systemInstruction: HTML_SYSTEM_PROMPT,
  });

  let html = result.response.text();

  // Clean up any markdown code fences if present
  html = html.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "");
  html = html.trim();

  return html;
}

const VIBE_CODE_SYSTEM_PROMPT = `You are an expert full-stack developer who creates beautiful, functional web applications. Your task is to generate complete, self-contained HTML pages based on user prompts.

RULES:
1. Generate ONLY valid HTML code - no markdown, no code fences, no explanations
2. Use Tailwind CSS via CDN for styling (include the script tag)
3. Create visually stunning, modern, and functional designs
4. Include interactive JavaScript where appropriate (inline <script> tags)
5. Make the UI fully responsive and professional-looking
6. Use realistic placeholder content and data
7. The HTML must be complete and self-contained (can be rendered in an iframe)
8. Start with <!DOCTYPE html> and include all necessary tags

STYLE GUIDELINES:
- Use modern, clean design with attention to detail
- Include smooth animations and transitions
- Use a cohesive, professional color palette
- Add proper hover states, focus states, and visual feedback
- Include Lucide icons via CDN when icons are needed
- Create pixel-perfect layouts with proper spacing
- Make text readable with excellent typography

FUNCTIONALITY:
- Add realistic interactivity with vanilla JavaScript
- Include form validation where appropriate
- Add loading states and feedback for user actions
- Make buttons and links functional within the page

Remember: You are "vibe coding" - creating something that looks and feels amazing, capturing the essence of what the user wants.`;

export async function vibeCode(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: VIBE_CODE_SYSTEM_PROMPT,
  });

  let html = result.response.text();

  // Clean up any markdown code fences if present
  html = html.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "");
  html = html.trim();

  return html;
}
