import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ChatProvider, useChat } from './context/ChatContext';
import { useAuth } from './context/AuthContext'; // import
import Sidebar from './components/Sidebar/Sidebar';
import ChatContainer from './components/ChatContainer/ChatContainer';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import { Menu, Sun, Moon, BarChart3 } from 'lucide-react';
import styles from './App.module.css';

function AuthenticatedApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const { chats, currentChatId, createNewChat, selectChat } = useChat();
  const { user, logout } = useAuth();

  return (
    <div className={`${styles.app} ${darkMode ? styles.dark : styles.light}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={() => {
          createNewChat();
          setSidebarOpen(false);
        }}
        onSelectChat={(chatId) => {
          selectChat(chatId);
          setSidebarOpen(false);
        }}
      />

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.iconBtn} onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className={styles.logoGroup}>
              <BarChart3 size={22} className={styles.logoIcon} />
              <h1 className={styles.title}>Trading<span>AI</span></h1>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.marketStatus}>
              <span className={styles.statusDot}></span>
              Live Markets
            </div>
            <button onClick={toggleTheme} className={styles.themeToggle}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user && (
              <button onClick={logout} className={styles.logoutBtn}>
                Logout
              </button>
            )}
          </div>
        </header>

        <section className={styles.chatWrapper}>
          <ChatContainer />
        </section>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // or a spinner

  return (
    <Routes>
      <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
      <Route
        path="/"
        element={
          user ? (
            <ChatProvider>
              <AuthenticatedApp />
            </ChatProvider>
          ) : (
            <Navigate to="/signin" />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;