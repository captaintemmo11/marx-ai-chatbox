export default async function handler(req, res) {
  // ✅ Chỉ chấp nhận POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history } = req.body || {};

    // ✅ Kiểm tra dữ liệu đầu vào
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    // ✅ Gọi API OpenAI
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
              "Bạn là một AI Triết học Mác–Lênin, có khả năng phân tích học thuật sâu, phản biện biện chứng và vận dụng linh hoạt. Hãy trả lời bằng tiếng Việt, rõ ràng, có ví dụ, lập luận logic, liên hệ thực tiễn Việt Nam nếu có thể."
          },
          ...(history || []),
          { role: "user", content: message }
        ],
        temperature: 0.8,
      }),
    });

    // ✅ Nếu OpenAI trả lỗi (ví dụ: key sai, quota hết,...)
    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API Error:", errText);
      return res.status(response.status).json({
        error: "OpenAI API error",
        details: errText.slice(0, 200) // tránh log quá dài
      });
    }

    // ✅ Parse JSON an toàn
    const data = await res

