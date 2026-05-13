const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export async function getDailySuggestions(
  tasks: string[],
  dayMode: string,
  aiContext: string,
  name: string
) {
  const prompt = `Suggest 3 tasks for ${name} (Day: ${dayMode}). Tasks: ${tasks.join(', ')}. Context: ${aiContext}. Return JSON array of objects with "task" and "reason".`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        })
      }
    )

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("RATE_LIMIT");
      }
      throw new Error(`Gemini error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  } catch (e) {
    console.error('Gemini failed:', e);
    return [
      { task: 'Breathe', reason: "The AI is currently overwhelmed, but you're doing great." },
      { task: 'Check your Supabase list', reason: "Your tasks are still there even if the AI is shy." },
      { task: 'Hydrate', reason: "A quick glass of water is a win." },
    ];
  }
}