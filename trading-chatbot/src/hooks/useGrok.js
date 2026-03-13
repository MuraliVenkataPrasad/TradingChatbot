import { useState, useCallback, useRef } from "react";

/* ================================
   ENV VARIABLES (GROQ)
================================ */
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

/* ================================
   TRADING KEYWORDS FILTER
================================ */
const TRADING_KEYWORDS = [
  "trading","trade","stock","stocks","market","markets",
  "invest","investment","investing","share","shares",
  "equity","equities","forex","currency","crypto",
  "bitcoin","ethereum","bond","bonds","commodity",
  "commodities","future","futures","option","options",
  "portfolio","dividend","earnings","bull","bear",
  "rally","correction","volatility","index","indices",
  "nasdaq","dow","s&p","ftse","dax","nikkei",
  "price","chart","analysis","technical","fundamental",
  "support","resistance","trend","rsi","macd",
  "bollinger","candlestick","breakout","entry","exit",
  "stoploss","risk","margin","leverage","long","short",
  "call","put","derivative","hedge","arbitrage","hello","hi"
];

const isTradingQuery = (messages) => {
  const lastUser = [...messages]
    .reverse()
    .find((m) => m.sender === "user");

  if (!lastUser) return false;

  const text = lastUser.text.toLowerCase();
  return TRADING_KEYWORDS.some((k) => text.includes(k));
};

/* ================================
   HOOK
================================ */
export const useGrok = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const sendMessage = useCallback(async (messages) => {

    /* ===== API KEY CHECK ===== */
    if (!API_KEY) {
      throw new Error("❌ Groq API Key Missing. Add VITE_GROQ_API_KEY in .env");
    }

    /* ===== TRADING FILTER ===== */
    if (!isTradingQuery(messages)) {
      return "📊 I am an AI Trading Assistant. Please ask only trading or stock market related questions.";
    }

    /* ===== CANCEL PREVIOUS ===== */
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      /* ===== FORMAT CHAT ===== */
      const formattedMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      /* ===== API CALL ===== */
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are a professional trading assistant. Give short, accurate stock market answers.",
            },
            ...formattedMessages,
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      const data = await response.json();

      /* ===== ERROR HANDLE ===== */
      if (!response.ok) {
        console.error("Groq API Error:", data);
        throw new Error(
          data.error?.message || "Groq API Request Failed"
        );
      }

      /* ===== RETURN AI TEXT ===== */
      return (
        data.choices?.[0]?.message?.content ||
        "⚠️ No response from AI"
      );

    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Hook Error:", err);
        setError(err.message);
        throw err;
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, []);

  return { sendMessage, loading, error };
};