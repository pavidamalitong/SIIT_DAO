import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import WalletConnect from "../component/WalletConnect";
import LogoutButton from "../component/LogoutButton";
import web3, { Voting, ProposalManager, Governance } from "../web3";
import { useGlobalState } from "../store";
import "../styles.css";

const ProposalDetail = () => {
  const { id } = useParams(); 
  const [account] = useGlobalState("connectedAccount");
  const [proposal, setProposal] = useState(null); 
  const [forCount, setForCount] = useState(0);
  const [againstCount, setAgainstCount] = useState(0);
  const [quorum, setQuorum] = useState(1);
  const [hasVoted, setHasVoted] = useState(false);
  const [executed, setExecuted] = useState(false);

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        const proposalData = await ProposalManager.methods
          .getProposal(id)
          .call();
        setProposal(proposalData);
        setForCount(Number(proposalData.forVotes));
        setAgainstCount(Number(proposalData.againstVotes));
        setQuorum(Number(proposalData.quorum));

        if (
          Number(proposalData.status) === 1 ||
          Number(proposalData.status) === 2
        ) {
          setExecuted(true);
        }

        if (account) {
          const userVoteStatus = await Voting.methods
            .hasVoted(id, account)
            .call();
          setHasVoted(userVoteStatus);
        }
      } catch (error) {
        console.error("Error fetching proposal details:", error);
      }
    };

    if (id) {
      fetchProposalDetails();
    }
  }, [id, account]);

  const handleVote = async (voteType) => {
    if (!account) {
      alert("Please connect your wallet to vote.");
      return;
    }

    if (window.ethereum) {
      try {
        await Voting.methods
          .vote(id, voteType === "For")
          .send({ from: account });

        // Update vote counts based on user action
        if (voteType === "For") {
          setForCount((prev) => prev + 1);
        } else {
          setAgainstCount((prev) => prev + 1);
        }

        setHasVoted(true); // Disable voting after successful action

        // After vote, check if proposal is ready for execution
        const proposal = await ProposalManager.methods.getProposal(id).call();

        if (Number(proposal.status) === 1) {
          alert("Proposal has been approved!");
        } else if (Number(proposal.status) === 2) {
          alert("Proposal has been rejected!");
        }

        // Trigger proposal execution if needed
        if (Number(proposal.status) === 1) {
          await Governance.methods.executeProposal(id).send({ from: account });
          alert("Proposal has been executed.");
        }
      } catch (error) {
        console.error("Vote transaction failed:", error);
        alert("Transaction failed. Please try again.");
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
        <div className="button-container">
          <WalletConnect />
          <LogoutButton />
        </div>
      </header>

      <div className="content">
        {proposal ? (
          <div className="proposal-section">
            <div className="proposal-title">{proposal.title}</div>
            <div className="proposer">Proposed by {proposal.proposer}</div>
            <div className="description">{proposal.description}</div>

            <div className="info-vote-container">
              <div className="info-topic">
                <div className="info-item">
                  <strong>Total votes</strong>
                </div>
                <div className="info-item">
                  <strong>Quorum</strong>
                </div>
                <div className="info-item">
                  <strong>Beneficiary</strong>
                </div>
                <div className="info-item">
                  <strong>Amount (ORC)</strong>
                </div>
              </div>
              <div className="info-result">
                <div className="info-item">
                  <span>{forCount + againstCount}</span>
                </div>
                <div className="info-item">
                  <span>{quorum}</span>
                </div>
                <div className="info-item">
                  <span>{proposal.beneficiary}</span>
                </div>
                <div className="info-item">
                  <span>{web3.utils.fromWei(proposal.amount, "ether")}</span>
                </div>
              </div>

              <div className="vote-section">
                <div className="vote-container">
                  <div className="for">
                    <span>For</span>
                    <span id="voteForCount">{forCount}</span>
                  </div>
                  <button
                    id="voteForButton"
                    className={`vote-button for ${
                      !account && !executed
                        ? "pre-disabled"
                        : hasVoted | executed
                        ? "voted-disabled"
                        : ""
                    }`}
                    onClick={() => handleVote("For")}
                    disabled={hasVoted | executed} // Disable if no account is connected or if the user has already voted
                  >
                    Vote
                  </button>

                  <div className="against">
                    <span>Against</span>
                    <span id="voteAgainstCount">{againstCount}</span>
                  </div>
                  <button
                    id="voteAgainstButton"
                    className={`vote-button against ${
                      !account && !executed
                        ? "pre-disabled"
                        : hasVoted | executed
                        ? "voted-disabled"
                        : ""
                    }`}
                    onClick={() => handleVote("Against")}
                    disabled={hasVoted | executed} // Disable if no account is connected or if the user has already voted
                  >
                    Vote
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading proposal details...</p>
        )}
      </div>
    </div>
  );
};

export default ProposalDetail;
