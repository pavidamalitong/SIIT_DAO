import React, { useEffect, useState } from "react";
import WalletConnect from "../component/WalletConnect";
import LogoutButton from "../component/LogoutButton";
import CreateProposal from "../component/CreateProposal";
import { useGlobalState } from "../store";
import { Link } from "react-router-dom";
import "../styles.css";

import web3, { Treasury, ProposalManager } from "../web3";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [connectedAccount] = useGlobalState("connectedAccount");
  const status = ["Active", "Approved", "Rejected"];

  const [treasuryValue, setTreasuryValue] = useState(0);
  const [proposals, setProposals] = useState([]);
  const [totalProposals, setTotalProposals] = useState(0);

  const handleNewProposal = () => {
    if (!connectedAccount) {
      alert("Please connect your wallet to create a proposal.");
      return;
    }
    setShowModal(true);
  };

  useEffect(() => {
    const loadBlockchainData = async () => {
      // Get Treasury Balance
      const balance = await Treasury.methods.getTreasuryBalance().call();
      const formattedBalance = web3.utils.fromWei(balance, "ether");
      setTreasuryValue(formattedBalance);

      // Fetch proposal count
      const proposalCount = await ProposalManager.methods
        .getProposalCount()
        .call();
      setTotalProposals(Number(proposalCount));
    };

    loadBlockchainData();
  }, []);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const fetchedProposals = [];
        for (let i = 0; i < totalProposals; i++) {
          const proposal = await ProposalManager.methods.getProposal(i).call();
          fetchedProposals.push(proposal);
        }
        console.log("Fetched proposals:", fetchedProposals);
        setProposals(fetchedProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    if (totalProposals > 0) {
      fetchProposals();
    }
  }, [totalProposals]);

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <h1>SIIT Event</h1>
          <p>se.dao.orc</p>
        </div>
        <div className="buttons">
          <button className="button" onClick={handleNewProposal}>
            + New Proposal
          </button>

          <div className="button-container">
            <WalletConnect />
            <LogoutButton />
          </div>
        </div>
      </header>

      {showModal && <CreateProposal onClose={() => setShowModal(false)} />}

      <div style={styles.summary}>
        <div style={styles.summaryItem}>
          <p style={styles.summaryTitle}>Total proposals</p>
          <h2 style={styles.summaryValue}>{totalProposals}</h2>
        </div>
        <div style={styles.summaryItem}>
          <p style={styles.summaryTitle}>Treasury value (ORC)</p>
          <h2 style={styles.summaryValue}>{treasuryValue}</h2>
        </div>
      </div>

      <section className="section" style={styles.section}>
        <h3 style={styles.sectionTitle}>All proposals</h3>
        {proposals.length > 0 ? (
          proposals.map((proposal, index) => (
            <ProposalCard
              key={index}
              id={index}
              title={proposal.title}
              proposer={proposal.proposer}
              status={status[Number(proposal.status)]}
              forVotes={Number(proposal.forVotes)}
              againstVotes={Number(proposal.againstVotes)}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>
            No proposals available.
          </p>
        )}
      </section>
    </div>
  );
};

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const ProposalCard = ({
  title,
  proposer,
  status,
  forVotes,
  againstVotes,
  id,
}) => {
  return (
    <Link
      to={`/proposal/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div style={styles.proposalCard} className="hover-effect">
        <div style={styles.proposalInfo}>
          <p style={styles.proposalTitle}>{title}</p>
          <p style={styles.proposedBy}>
            Proposed by {shortenAddress(proposer)}
          </p>
        </div>
        <div style={styles.proposalSection}>
          <p style={styles.proposalHeader}>Status</p>
          <strong style={{ ...styles.proposalValue, color: "#06DECC" }}>
            {status}
          </strong>
        </div>
        <div style={styles.votes}>
          <p style={styles.proposalHeader}>For</p>
          <strong style={{ ...styles.proposalValue, color: "#15E754" }}>
            {forVotes}
          </strong>
        </div>
        <div style={styles.votes}>
          <p style={styles.proposalHeader}>Against</p>
          <strong style={{ ...styles.proposalValue, color: "#E52E3A" }}>
            {againstVotes}
          </strong>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  summary: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    textAlign: "center",
    fontSize: "25px",
    padding: "0 200px",
    marginTop: "15px",
  },
  summaryItem: {
    flex: 1,
  },
  summaryTitle: {
    marginBottom: "0px",
    fontSize: "24px",
    color: "#696969",
  },
  summaryValue: {
    marginTop: "10px",
    fontSize: "50px",
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    width: "100%",
    padding: "0 80px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  proposalCard: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    alignItems: "center",
    padding: "20px",
    marginBottom: "10px",
    border: "2px solid #06DECC",
    borderRadius: "15px",
    backgroundColor: "white",
  },
  proposalSection: {
    textAlign: "center",
    padding: "5px 0",
  },
  proposalHeader: {
    fontSize: "16px",
    color: "#696969",
    margin: "0 0 4px 0",
  },
  proposalValue: {
    fontSize: "19px",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
  },
  proposalTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: 0,
  },
  proposedBy: {
    color: "#696969",
    margin: 0,
  },
  proposalStatus: {
    textAlign: "center",
  },
  votes: {
    textAlign: "center",
  },
};

export default Home;
