export async function sendToDeepseek(prompt: string, apiKey: string) {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      stream: false,
    }),
  });

  const data = await response.json();
  console.log("Deepseek response", data); // ✅ 添加日志
  return data.choices?.[0]?.message?.content || "无回复";
}
