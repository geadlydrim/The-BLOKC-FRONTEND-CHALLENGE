// pages/index.js
import React from 'react';
import styles from '@/styles/Index.module.css'
import WalletInterface from './components/WalletInterface';

const HomePage = () => {
  
  return (
    <div className={styles.boxContainer}>
      <h1>Metamask Auth</h1>
      <WalletInterface/>
    </div>
  );
};

export default HomePage;
