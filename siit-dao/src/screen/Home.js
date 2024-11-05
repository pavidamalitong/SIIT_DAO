import React from 'react';
import { FiLogOut } from 'react-icons/fi';

const Home = () => {
  // Example values for total proposals and treasury value; these could be dynamically fetched from an API
    const totalProposals = 5;
    const treasuryValue = 300.0;

    return (
        <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
            <div>
            <h1 style={styles.title}>SIIT Event</h1>
            <p style={styles.subtitle}>se.dao.orc</p>
            </div>
            <div style={styles.buttons}>
            <button style={styles.newProposalButton}>+ New proposal</button>
            <button style={styles.connectWalletButton}>Connect wallet</button>
            <button style={styles.logoutButton}>
                <FiLogOut style={styles.icon} />
            </button>
            </div>
        </header>

        {/* Summary */}
        <div style={styles.summary}>
            <div style={styles.summaryItem}>
            <p>Total proposal</p>
            <h2>{totalProposals}</h2>
            </div>
            <div style={styles.summaryItem}>
            <p>Treasury value (ORC)</p>
            <h2>{treasuryValue.toFixed(2)}</h2>
            </div>
        </div>

        {/* Proposal List */}
        <section>
            <h3 style={styles.sectionTitle}>All proposals</h3>
            <ProposalCard 
            title="SIIT Back to school event" 
            proposer="0x1234...abcd" 
            status="Active" 
            forVotes={3} 
            againstVotes={1} 
            />
            <ProposalCard 
            title="SIIT Baan day event" 
            proposer="0x5678...efgh" 
            status="Executed" 
            forVotes={5} 
            againstVotes={0} 
            />
            <ProposalCard 
            title="SIIT Openhouse" 
            proposer="0x9abc...ijkl" 
            status="Executed" 
            forVotes={10} 
            againstVotes={0} 
            />
        </section>
        </div>
    );
    };

    // ProposalCard component
    const ProposalCard = ({ title, proposer, status, forVotes, againstVotes }) => {
    return (
        <div style={styles.proposalCard}>
        <div style={styles.proposalInfo}>
            <p style={styles.proposalTitle}>{title}</p>
            <p style={styles.proposedBy}>Proposed by {proposer}</p>
        </div>
        <div style={styles.proposalStatus}>
            <p>Status</p>
            <strong>{status}</strong>
        </div>
        <div style={styles.votes}>
            <p>For</p>
            <strong>{forVotes}</strong>
        </div>
        <div style={styles.votes}>
            <p>Against</p>
            <strong>{againstVotes}</strong>
        </div>
        </div>
    );
    };

    // Styles
    const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '700px',
        margin: '0 auto',
        backgroundColor: '#f5fafa',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
    },
    buttons: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    newProposalButton: {
        backgroundColor: '#3de0c4',
        color: '#fff',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    connectWalletButton: {
        backgroundColor: '#3de0c4',
        color: '#fff',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    logoutButton: {
        backgroundColor: '#3de0c4',
        color: '#fff',
        padding: '8px 12px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        fontSize: '18px',
    },
    summary: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        textAlign: 'center',
    },
    summaryItem: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    proposalCard: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        alignItems: 'center',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #3de0c4',
        borderRadius: '5px',
    },
    proposalInfo: {
        textAlign: 'left',
    },
    proposalTitle: {
        fontWeight: 'bold',
        margin: 0,
    },
    proposedBy: {
        color: '#666',
        margin: 0,
    },
    proposalStatus: {
        textAlign: 'center',
    },
    votes: {
        textAlign: 'center',
    },
    };

export default Home;
