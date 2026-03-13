import React from 'react';
import styles from './MessageBubble.module.css';

const MessageBubble = ({ message }) => {
  // 1. Safety Check: Don't crash if message is missing
  if (!message) return null;

  // 2. Flexible Sender Check: Handles both Gemini (sender) and Grok (role) formats
  const isUser = message.sender === 'user' || message.role === 'user';
  const isError = message.isError;

  // 3. Content Fallback: Grok uses .content, your state uses .text
  const textContent = message.text || message.content || "Empty message";

  // 4. Robust Time Formatting
  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className={`${styles.wrapper} ${isUser ? styles.userWrapper : styles.aiWrapper}`}>
      
      {/* AI Avatar - Modern Iconography */}
      {!isUser && (
        <div className={`${styles.avatar} ${isError ? styles.errorAvatar : styles.aiAvatar}`}>
          {isError ? '!' : 'AI'}
        </div>
      )}

      <div className={`
        ${styles.bubble} 
        ${isUser ? styles.userBubble : styles.aiBubble} 
        ${isError ? styles.errorBubble : ''}
      `}>
        <div className={styles.text}>{textContent}</div>
        <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
      </div>
      
    </div>
  );
};

export default MessageBubble;