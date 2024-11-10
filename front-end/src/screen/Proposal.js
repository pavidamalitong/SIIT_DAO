import React, { useState } from 'react';
import WalletConnect from './WalletConnect';
import { useGlobalState } from '../store';
import '../styles.css';

function Proposal() {
  // const [account, setAccount] = useState(null); // Store connected wallet address
  const [account] = useGlobalState('connectedAccount');
  const [forCount, setForCount] = useState(2); // Initial "For" vote count
  const [againstCount, setAgainstCount] = useState(1); // Initial "Against" vote count
  const [hasVoted, setHasVoted] = useState(false); // Track if user has voted

  // const handleWalletConnect = (walletAddress) => {
  //   setAccount(walletAddress);
  // };

  const handleVote = async (voteType) => {
    if (!account) {
      alert("Please connect your wallet to vote.");
      return;
    }

    if (window.ethereum) {
      try {
        const contractAddress = "0x0000000000000000000000000000000000000000"; // Replace with actual contract address
        const tx = {
          from: account,
          to: contractAddress,
          value: "0x0",
          data: voteType === "For" ? "0x01" : "0x02",
        };

        console.log("Transaction object prepared:", tx); 

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
        });

        console.log(`Vote ${voteType} transaction sent with hash:`, txHash);
        alert(`Vote transaction sent with hash: ${txHash}`);

        if (voteType === "For") {
          setForCount(forCount + 1);
        } else {
          setAgainstCount(againstCount + 1);
        }

        // Set hasVoted to true to disable further voting
        setHasVoted(true);
      } catch (error) {
        console.error("Vote transaction failed:", error);
        alert("Transaction failed.");
      }
    } else {
      alert("MetaMask is not installed.");
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <h1>SIIT Event</h1>
          <p>se.dao.orc</p>
        </div>
        <WalletConnect /> {/* Connect wallet button */}
      </header>

      <div className="content">
        {/* <div id="overlay" className="overlay"></div> */}

        {/* Proposal Page Layout */}
        <div className="proposal-section">
          <div className="proposal-title">SIIT Back to School Event</div>
          <div className="proposer">Proposed by 0x...</div>
          <div className="description">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus voluptatibus officiis corrupti dolore nihil eos quos, quod quo soluta, molestias eligendi, fuga natus iste iusto illo esse commodi. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus voluptatibus officiis corrupti dolore nihil eos quos, quod quo soluta, molestias eligendi, fuga natus iste iusto illo esse commodi.
          </div>
          
          {/* Voting Section */}
          <div className="info-vote-container">
            <div className="info-topic">
              <div className="info-item"><strong>Total votes</strong></div>
              <div className="info-item"><strong>Quorum</strong></div>
              <div className="info-item"><strong>Start</strong></div>
              <div className="info-item"><strong>End</strong></div>
            </div>
            <div className="info-result">
              <div className="info-item"><span>3</span></div>
              <div className="info-item"><span>4</span></div>
              <div className="info-item"><span>30/10/2025 11:00 AM</span></div>
              <div className="info-item"><span>31/10/2025 11:00 AM</span></div>
            </div>
            <div className="vote-section">
              <div className="vote-container">
                <div className="for">
                  <span>For</span>
                  <span id="voteForCount">{forCount}</span> {/* Display updated "For" count */}
                </div>
                <button 
                  id="voteForButton" 
                  className={`vote-button for ${!account ? 'pre-disabled' : hasVoted ? 'voted-disabled' : ''}`}
                  onClick={() => handleVote("For")}
                  disabled={hasVoted} // Disable if already voted
                >
                  Vote
                </button>

                <div className="against">
                  <span>Against</span>
                  <span id="voteAgainstCount">{againstCount}</span> {/* Display updated "Against" count */}
                </div>
                <button 
                  id="voteAgainstButton" 
                  className={`vote-button against ${!account ? 'pre-disabled' : hasVoted ? 'voted-disabled' : ''}`}
                  onClick={() => handleVote("Against")}
                  disabled={hasVoted} // Disable if already voted
                >
                  Vote
                </button>
              </div>
            </div>
          </div>

          {/* Voters List */}
          <div className="voters-list">
            <p>Voters</p>
            <div className="voter-item"><span>0x....</span> <span>For</span></div>
            <div className="voter-item"><span>0x....</span> <span>For</span></div>
            <div className="voter-item"><span>0x....</span> <span>Against</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Proposal;
