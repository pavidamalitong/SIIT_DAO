import React, { useState } from 'react';
import { BrowserProvider } from 'ethers';
import '../styles.css';

function WalletConnect({ onConnect }) {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("wallet_requestPermissions", [{ eth_accounts: {} }]);
        
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);
        onConnect(userAddress); // Pass connected account back to parent component
        console.log("Connected account:", userAddress);
      } catch (error) {
        console.error("Connection failed:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install it to connect your wallet.");
    }
  };

  const logoutWallet = () => {
    setAccount(null);
    onConnect(null); // Update parent on disconnect
    console.log("Logged out");
  };

  const shortenAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet";
  };

  return (
    <div className="wallet-container">
      <button 
        onClick={account ? null : connectWallet} // Disable onClick if account is connected
        className={`connect-wallet ${account ? 'connected' : ''}`}
        disabled={!!account} // Disable the button when connected
      >
        {shortenAddress(account)}
      </button>
      
      {account && (
        <button onClick={logoutWallet} className="logout-button">
          <img src="/logout.png" alt="Logout" className="logout-icon" />
        </button>
      )}
    </div>
  );
}

export default WalletConnect;
