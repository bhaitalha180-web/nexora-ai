exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server key is not configured" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const message = String(body.message || "").trim();
    if (!message || message.length > 4000) {
      return { statusCode: 400, body: JSON.stringify({ error: "Message is empty or too long" }) };
    }

    const upstream = await fetch(https://script.google.com/macros/s/AKfycbxx7bc1lc4p3kNaZewZ4Qwigq8u_Qd6lp03cgUWOo6FHEuhhHnndxMmQ6ZtRPL-sB6KeA/exec
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "You are NEXORA AI, a helpful assistant. Reply in the same language as the user (Urdu, Pashto, or English). Keep explanations clear and friendly. For schoolwork, teach step by step rather than just giving unexplained answers." }]
          },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
        })
      }
    );

    const result = await upstream.json();
    if (!upstream.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: "AI provider error", detail: result.error?.message || "Please try again later." }) };
    }
    const reply = result.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: reply || "Mujhe jawab nahi mil saka. Dobara poochhein." })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
