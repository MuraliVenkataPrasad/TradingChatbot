// import { useState, useCallback, useRef } from 'react';

// const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

// // Simple trading-related keyword check (case-insensitive)
// const TRADING_KEYWORDS = [
//   'trading', 'trade', 'stock', 'stocks', 'market', 'markets',
//   'invest', 'investment', 'investing', 'share', 'shares',
//   'equity', 'equities', 'forex', 'currency', 'crypto',
//   'bitcoin', 'ethereum', 'bond', 'bonds', 'commodity',
//   'commodities', 'future', 'futures', 'option', 'options',
//   'portfolio', 'dividend', 'earnings', 'bull', 'bear',
//   'rally', 'correction', 'volatility', 'index', 'indices',
//   'nasdaq', 'dow jones', 's&p', 'ftse', 'dax', 'nikkei',
//   'price', 'prices', 'quote', 'quotes', 'chart', 'charts',
//   'analysis', 'technical', 'fundamental', 'support', 'resistance',
//   'trend', 'trends', 'moving average', 'rsi', 'macd', 'bollinger',
//   'candle', 'candlestick', 'pattern', 'patterns', 'breakout',
//   'entry', 'exit', 'stop loss', 'take profit', 'risk management',
//   'margin', 'leverage', 'short', 'long', 'call', 'put',
//   'derivative', 'derivatives', 'hedge', 'hedging', 'arbitrage','hi'
// ];

// const isTradingQuery = (messages) => {
//   // Find the last user message
//   const lastUserMsg = [...messages].reverse().find(msg => msg.sender === 'user');
//   if (!lastUserMsg) return false; // no user message → refuse

//   const text = lastUserMsg.text.toLowerCase();
//   return TRADING_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
// };

// export const useGemini = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const abortControllerRef = useRef(null);

//   const sendMessage = useCallback(async (messages) => {
//     // 1. Quick local check: is the query trading-related?
//     if (!isTradingQuery(messages)) {
//       return "I'm a trading assistant and can only answer trading-related questions. Please ask me about stocks, markets, investments, etc.";
//     }

//     // 2. Proceed with API call (abort previous if any)
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }
//     abortControllerRef.current = new AbortController();

//     setLoading(true);
//     setError(null);

//     try {
//       // Format conversation for Gemini
//       const contents = messages.map(msg => ({
//         role: msg.sender === 'user' ? 'user' : 'model',
//         parts: [{ text: msg.text }]
//       }));

//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         signal: abortControllerRef.current.signal,
//         body: JSON.stringify({ contents })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error?.message || 'API request failed');
//       }

//       const data = await response.json();
//       const aiText = data.candidates[0].content.parts[0].text;
//       return aiText;
//     } catch (err) {
//       if (err.name !== 'AbortError') {
//         setError(err.message);
//         throw err;
//       }
//     } finally {
//       setLoading(false);
//       abortControllerRef.current = null;
//     }
//   }, []);

//   return { sendMessage, loading, error };
// };