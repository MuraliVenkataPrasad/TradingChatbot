import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const ChatContext = createContext();

// Normalize backend _id to id for component compatibility
const normalize = (chat) => ({ ...chat, id: chat._id || chat.id });

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/conversations');
      const normalized = data.map(normalize);
      setChats(normalized);
      if (normalized.length > 0) {
        setCurrentChatId(normalized[0].id);
      } else {
        createNewChat();
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      const saved = localStorage.getItem('trading_chats');
      if (saved) {
        setChats(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = async () => {
    try {
      const { data } = await API.post('/conversations', { title: 'New Analysis' });
      const chat = normalize(data);
      setChats(prev => [chat, ...prev]);
      setCurrentChatId(chat.id);
      return chat;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      const newChat = {
        id: crypto.randomUUID(),
        title: 'New Analysis',
        messages: [],
        createdAt: new Date().toISOString()
      };
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      return newChat;
    }
  };

  const selectChat = (id) => setCurrentChatId(id);

  const addMessage = async (message) => {
    setChats(prev => prev.map(chat =>
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, message] }
        : chat
    ));

    try {
      const chat = chats.find(c => c.id === currentChatId);
      if (chat) {
        const updatedMessages = [...chat.messages, message];
        await API.put(`/conversations/${currentChatId}`, { messages: updatedMessages });
      }
    } catch (error) {
      console.error('Failed to sync message with backend:', error);
    }
  };

  const updateChatTitle = async (chatId, title) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, title } : chat
    ));

    try {
      await API.put(`/conversations/${chatId}`, { title });
    } catch (error) {
      console.error('Failed to update title in backend:', error);
    }
  };

  const deleteChat = async (chatId) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== chatId);
      if (filtered.length === 0) {
        createNewChat();
        return filtered;
      }
      return filtered;
    });

    try {
      await API.delete(`/conversations/${chatId}`);
    } catch (error) {
      console.error('Failed to delete from backend:', error);
    }
  };

  return (
    <ChatContext.Provider value={{
      chats, currentChatId, loading, createNewChat, selectChat, addMessage, updateChatTitle, deleteChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
