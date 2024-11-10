import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  connectedAccount: null,    // Stores the connected wallet address
  contract: null,            // Holds the smart contract instance
  proposals: [],             // Stores the list of proposals
};

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState(initialState);

export {
    setGlobalState,
    useGlobalState,
    getGlobalState
};
