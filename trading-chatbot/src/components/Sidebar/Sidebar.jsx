import React from 'react';
import { Plus, MessageSquare, Clock } from 'lucide-react'; // Modern icons
import styles from './Sidebar.module.css';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  chats = [], 
  currentChatId, 
  onSelectChat, 
  onNewChat 
}) => {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarContent}>
          <div className={styles.header}>
            <button className={styles.newChatBtn} onClick={onNewChat}>
              <Plus size={18} />
              <span>New Thread</span>
            </button>
          </div>
          
          <div className={styles.chatList}>
            <p className={styles.sectionTitle}>Recent Conversations</p>
            
            {chats.length === 0 ? (
              <div className={styles.emptyState}>No history yet</div>
            ) : (
              chats.map(chat => {
                const lastMessage = chat.messages?.[chat.messages.length - 1];
                const displayDate = lastMessage?.timestamp 
                  ? new Date(lastMessage.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) 
                  : 'Just now';

                const isActive = chat.id === currentChatId;

                return (
                  <button
                    key={chat.id}
                    className={`${styles.chatItem} ${isActive ? styles.active : ''}`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <MessageSquare size={16} className={styles.chatIcon} />
                    <div className={styles.chatInfo}>
                      <span className={styles.chatTitle}>{chat.title || "Untitled Chat"}</span>
                      <span className={styles.chatDate}>{displayDate}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
          
          <div className={styles.footer}>
            <div className={styles.userProfile}>
              
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;