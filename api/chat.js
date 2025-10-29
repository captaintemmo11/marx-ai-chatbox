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
          { role: "system", content: "B?n l� AI Tri?t h?c Kinh t? M�c-L�nin, c� kh? n�ng ph�n t�ch h?c thu?t s�u, ph?n bi?n, v� v?n d?ng th?c t? linh ho?t. H?y tr? l?i m?t c�ch ch?t ch?, logic v� c� chi?u s�u tri?t h?c, k? c? khi c�u h?i ngo�i gi�o tr?nh." },
          ...(history || []),
          { role: "user", content: message },
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Kh�ng th? ph�n t�ch ��?c c�u h?i n�y.";

    res.status(200).json({ reply: content });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "OpenAI API call failed." });
  }
}
