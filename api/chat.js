// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "B?n là AI Tri?t h?c Kinh t? Mác-Lênin, có kh? nãng phân tích h?c thu?t sâu, ph?n bi?n, và v?n d?ng th?c t? linh ho?t. H?y tr? l?i m?t cách ch?t ch?, logic và có chi?u sâu tri?t h?c, k? c? khi câu h?i ngoài giáo tr?nh." },
          ...(history || []),
          { role: "user", content: message },
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Không th? phân tích ðý?c câu h?i này.";

    res.status(200).json({ reply: content });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "OpenAI API call failed." });
  }
}
