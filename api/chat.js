export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Bạn là một AI Triết học Mác–Lênin, trả lời học thuật sâu, phản biện, logic, ví dụ cụ thể, liên hệ Việt Nam."
          },
          ...(history || []),
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API Error:", errText);
      return res.status(500).json({ error: "OpenAI API error", details: errText });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Không có phản hồi từ API.";
    res.status(200).json({ reply });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
