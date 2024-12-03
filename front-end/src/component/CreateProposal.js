import React, { useState } from "react";
import { useGlobalState } from "../store";
import "../styles.css";
import web3, { ProposalManager } from "../web3";

const CreateProposal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [quorum, setQuorum] = useState(0);
  const [connectedAccount] = useGlobalState("connectedAccount");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!connectedAccount) {
      alert("Please connect your wallet to submit the proposal.");
      return;
    }

    try {
      // Ensure the required fields are filled
      if (!title || !address || !amount || !description || !quorum) {
        alert("Please fill in all fields.");
        return;
      }

      // Send the transaction to create a proposal
      const tx = await ProposalManager.methods
        .createProposal(
          title,
          description,
          address,
          web3.utils.toWei(amount.toString(), "ether"),
          quorum
        )
        .send({ from: connectedAccount });

      alert("Proposal created successfully!");

      // Close the modal after submission
      onClose();
    } catch (error) {
      console.error("Error creating proposal:", error);
      alert("Error creating proposal.");
    }
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

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Quorum</label>
          <input
            type="number"
            value={quorum}
            onChange={(e) => setQuorum(e.target.value)}
            required
          />

          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProposal;
