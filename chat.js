exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "POST request required" })
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GEMINI_API_KEY missing in Netlify" })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const message = String(body.message || "").trim();

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is empty" })
      };
    }

    const result = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await result.json();

    if (!result.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "Gemini API error",
          detail: data.error?.message || "Gemini request failed"
        })
      };
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: reply || "No reply received" })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
