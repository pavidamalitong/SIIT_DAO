import React, { useState } from 'react';
import WalletConnect from '../component/WalletConnect';
import LogoutButton from '../component/LogoutButton'; 
import CreateProposal from '../component/CreateProposal';
import { useGlobalState } from '../store';
import { Link } from 'react-router-dom';
import '../styles.css';


const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [connectedAccount] = useGlobalState('connectedAccount');

    const handleNewProposal = () => {
        if (!connectedAccount) {
            alert("Please connect your wallet to create a proposal.");
            return;
        }
        setShowModal(true);
    };

    const totalProposals = 0;
    const treasuryValue = 300.0;

    return (
        <div className="App">
            <header className="header">
                <div className="header-content">
                    <h1>SIIT Event</h1>
                    <p>se.dao.orc</p>
                </div>
                <div className="buttons">
                    <button className="button" onClick={handleNewProposal}>+ New Proposal</button>
                    
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
                <h2 style={styles.summaryValue}>{treasuryValue.toFixed(2)}</h2>
            </div>
            </div>
    
            <section className="section" style={styles.section}>
            <h3 style={styles.sectionTitle}>All proposals</h3>
                <ProposalCard 
                    title="SIIT Back to school event" 
                    proposer="0x1234567890abcdef1234567890abcdef12345678" 
                    status="Active" 
                    forVotes={3} 
                    againstVotes={1} 
                />
                <ProposalCard 
                    title="SIIT Baan day event" 
                    proposer="0x567890abcdef1234567890abcdef1234567890ab"  
                    status="Executed" 
                    forVotes={5} 
                    againstVotes={0} 
                />
            </section>
        </div>
        );
    };

    const shortenAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const ProposalCard = ({ title, proposer, status, forVotes, againstVotes, id }) => {
        return (
            <Link to={`/proposal/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={styles.proposalCard}  className="hover-effect">
                    <div style={styles.proposalInfo}>
                        <p style={styles.proposalTitle}>{title}</p>
                        <p style={styles.proposedBy}>Proposed by {shortenAddress(proposer)}</p>
                    </div>
                    <div style={styles.proposalSection}>
                        <p style={styles.proposalHeader}>Status</p>
                        <strong style={{ ...styles.proposalValue, color: '#06DECC' }}>{status}</strong>
                    </div>
                        <div style={styles.votes}>
                        <p style={styles.proposalHeader} >For</p>
                        <strong style={{ ...styles.proposalValue, color: '#15E754' }}>{forVotes}</strong>
                    </div>
                        <div style={styles.votes}>
                        <p style={styles.proposalHeader}>Against</p>
                        <strong style={{ ...styles.proposalValue, color: '#E52E3A' }}>{againstVotes}</strong>
                    </div>
                </div>
            </Link>
        );
    };

const styles = {
    summary: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        textAlign: 'center',
        fontSize: '25px',
        padding: '0 200px',
        marginTop: '15px', 
        },
    summaryItem: {
        flex: 1,
        },
    summaryTitle: {
        marginBottom: '0px', 
        fontSize: '24px',
        color: '#696969',
        },
    summaryValue: {
        marginTop: '10px',
        fontSize: '50px', 
        fontWeight: 'bold',
        color: '#333',
        },
    section: {
        width: '100%',
        padding: '0 80px'
        },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '15px',
        },
    proposalCard: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        alignItems: 'center',
        padding: '20px',
        marginBottom: '10px',
        border: '2px solid #06DECC',
        borderRadius: '15px',
        backgroundColor: 'white'
        },
    proposalSection: {
        textAlign: 'center',
        padding: '5px 0',
        },
    proposalHeader: {
        fontSize: '16px',
        color: '#696969',
        margin: '0 0 4px 0', 
        },
    proposalValue: {
        fontSize: '19px',
        fontWeight: 'bold',
        color: '#333',
        margin: 0,
        },
    proposalTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        margin: 0,
        },
    proposedBy: {
        color: '#696969',
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
