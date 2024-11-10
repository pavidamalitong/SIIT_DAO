import React, { useState } from 'react';
import { useGlobalState } from '../store';
import '../styles.css';
// import contractAbi from '.../back-end/contracts/ProposalContract.json';
// import { ethers } from 'ethers';

const CreateProposal = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setSummary] = useState('');
    const [connectedAccount] = useGlobalState('connectedAccount');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!connectedAccount) {
            alert("Please connect your wallet to submit the proposal.");
            return;
        }

    //     try {
    //         const provider = new ethers.BrowserProvider(window.ethereum);
    //         const signer = await provider.getSigner();
    //         const contractAddress = "0xContractAddress"; // Replace with actual contract address
    //         const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    //         // Encode the function call data
    //         const data = contract.interface.encodeFunctionData("createProposal", [
    //             description,                           
    //             ethers.utils.parseUnits(amount, "ether") // Fund amount (passed as parameter, not included in transaction)
    //         ]);

    //         const transactionParameters = {
    //             from: connectedAccount,
    //             to: contractAddress,
    //             value: "0x0", // No additional ETH sent, user only pays gas fee
    //             data: data, 
    //         };

    //         // Send transaction through MetaMask
    //         const txHash = await window.ethereum.request({
    //             method: 'eth_sendTransaction',
    //             params: [transactionParameters],
    //         });

    //         console.log("Proposal submitted with transaction hash:", txHash);
    //         alert(`Proposal submitted! Transaction hash: ${txHash}`);
    //         onClose();
    //     } catch (error) {
    //         console.error("Proposal submission failed:", error);
    //         alert("Transaction failed. Please try again.");
    //     }
        };

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Create a Proposal</h2>
                <form onSubmit={handleSubmit}>
                    <label>Title</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />

                    <label>Beneficiary Address</label>
                    <input 
                        type="text" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)} 
                        required 
                    />

                    <label>Fund (ORC)</label>
                    <input 
                        type="number" 
                        value={amount}
                        placeholder="e.g. 100"
                        onChange={(e) => setAmount(e.target.value)} 
                        required 
                    />

                    <label>Summary</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setSummary(e.target.value)} 
                        required 
                    />

                    <button type="submit" className="button">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CreateProposal;
