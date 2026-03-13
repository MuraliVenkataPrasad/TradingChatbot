import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from '../MessageBubble/MessageBubble';
import ChatInput from '../ChatInput/ChatInput';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
// import { useGemini } from '../../hooks/useGemini'; 
import { useGrok } from '../../hooks/useGrok';
import { useChat } from '../../context/ChatContext';
import styles from './ChatContainer.module.css';

const ChatContainer = () => {
  const { currentChatId, chats, addMessage, updateChatTitle } = useChat();
  const { sendMessage, loading } = useGrok();
  const messagesEndRef = useRef(null);

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (userInput) => {
    if (!currentChatId || !userInput.trim()) return;

    const userMessage = {
      id: crypto.randomUUID(),
      text: userInput,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    addMessage(userMessage);

    if (messages.length === 0) {
      const title = userInput.slice(0, 30) + (userInput.length > 30 ? '…' : '');
      updateChatTitle(currentChatId, title);
    }

    try {
      const aiResponse = await sendMessage([...messages, userMessage]);
      addMessage({
        id: crypto.randomUUID(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      addMessage({
        id: crypto.randomUUID(),
        text: `Error: ${err.message}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatWrapper}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.aiIcon}>✨</div>
            <h1>How can I help you trade today?</h1>
            <p>Ask about market trends, technical analysis, or strategies.</p>
            
            <div className={styles.quickActions}>
              <button onClick={() => handleSend("Analyze current BTC trend")}>📈 Bitcoin Trend</button>
              <button onClick={() => handleSend("Explain RSI for beginners")}>🧠 RSI Basics</button>
              <button onClick={() => handleSend("Top stocks to watch")}>👀 Market Watch</button>
            </div>
          </div>
        ) : (
          <div className={styles.messagesList}>
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <ChatInput onSend={handleSend} disabled={loading} />
          <p className={styles.disclaimer}>
            Grok may provide inaccurate financial data. Always verify signals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;