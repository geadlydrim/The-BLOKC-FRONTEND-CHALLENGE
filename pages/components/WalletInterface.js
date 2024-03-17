import React from 'react'
import { useEffect, useState } from "react";
import styles from '@/styles/WalletInterface.module.css'

function WalletInterface(){
  const[walletAddress, setWalletAddress] = useState();
  const[etherBalance, setEtherBalance] = useState(0);
  const[status, setStatus] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if(typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
      try{
          /* MetaMask is installed */
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          const statusValue = "Connected";

          setStatus(statusValue);
          setWalletAddress(accounts[0]);
          fetchBalance();

          console.log(accounts[0]);
        }
      catch (err) {
          setStatus("MetaMask is not installed");
          console.error(err.message);
      }
    }
    else{
      setStatus("MetaMask not detected");
    }
  }

  const getCurrentWalletConnected = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setStatus("Connected");
          setWalletAddress(accounts[0]);
        }
        else{
          setStatus("Disconnected");
        } 
      }
      catch(err){
        console.error(err.message);
      }
    }
    else{
      setStatus("MetaMask not detected");
    }
  }

  const addWalletListener = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
      });
    }
    else{
      setWalletAddress("");
      setStatus("MetaMask not detected");
    }
  }

  const fetchBalance = async () => {
    if(walletAddress !== undefined){
      try{
        const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [walletAddress, "latest"],
      })
  
        const { fromWei } = require("web3-utils");
        const toEtherBalance = fromWei(balance, "ether");
        setEtherBalance(toEtherBalance);
      }
      catch(error){
        console.error("Error fetching balance: ", error);
      }
    }
    else{
      setStatus("Address is undefined");
    }
  }

  return(
    <div className={styles.walletBox}>
      <p>Status: {status}</p>
      <button className={styles.connectButton} onClick={connectWallet}>Connect With MetaMask</button>
      <span>
      {walletAddress && walletAddress.length > 0 ? `Wallet Adress: ${walletAddress.slice(0, 6)}...${walletAddress.slice(38)}` : "Wallet Address: "}
      </span>
      <div className={styles.balanceDisplay}>
        <button className={styles.reloadButton} onClick={fetchBalance}>
          <img src='../../refresh.png' alt="reload"></img>
        </button>
        <span>Balance: {etherBalance}</span>
      </div>
    </div>
  )
}

export default WalletInterface