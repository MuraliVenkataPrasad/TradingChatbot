import React from 'react';
import styles from './TypingIndicator.module.css';

const TypingIndicator = () => {
  return (
    <div className={styles.container}>
      <div className={styles.aiLabel}>AI is thinking</div>
      <div className={styles.wrapper}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
};

export default TypingIndicator;