import React, { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { setGlobalState, getGlobalState } from "../store";
import "../styles.css";

import web3, { TokenFaucet } from "../web3";

const WalletConnect = () => {
  const [account, setAccount] = useState(
    getGlobalState("connectedAccount") ||
      localStorage.getItem("connectedAccount")
  );

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("wallet_requestPermissions", [
          { eth_accounts: {} },
        ]);

        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        setAccount(userAddress);
        setGlobalState("connectedAccount", userAddress);
        localStorage.setItem("connectedAccount", userAddress); // Save to localStorage
        console.log("Connected account:", userAddress);

        // Automatically claim tokens
        const tx = await TokenFaucet.methods
          .claimTokens()
          .send({ from: userAddress });
        console.log("Tokens claimed successfully!", tx);
      } catch (error) {
        console.error("Connection failed:", error);
      }
    } else {
      alert(
        "MetaMask is not installed. Please install it to connect your wallet."
      );
    }
  };

  const shortenAddress = (address) => {
    return address
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : "Connect Wallet";
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const storedAccount = localStorage.getItem("connectedAccount");
    if (storedAccount) {
      setAccount(storedAccount);
      setGlobalState("connectedAccount", storedAccount);
    }
  }, []);

  return (
    <div className="wallet-container">
      <button
        onClick={account ? null : connectWallet} // Disable onClick if account is connected
        className={`connect-wallet ${account ? "connected" : ""}`}
        disabled={!!account} // Disable the button when connected
      >
        {shortenAddress(account)}
      </button>
    </div>
  );
};

export default WalletConnect;
