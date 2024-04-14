import './App.css';

import React from 'react';
import Web3 from 'web3';
import { simpleStorageAbi, contractAddress } from './abis';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Card from './components/pages/Card';
import Proposal from './components/pages/Proposal';
import NewProposal from './components/pages/NewProposal';
import VotedProposals from './components/pages/VotedProposals';

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
// contract address is provided by Truffle migration
const contractAddr = contractAddress;
const SimpleContract = new web3.eth.Contract(simpleStorageAbi, contractAddr);

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Card SimpleContract={SimpleContract} />} />
        <Route path="/new-proposal" element={<NewProposal SimpleContract={SimpleContract} />} />
        <Route path="/voted-proposals" element={<VotedProposals SimpleContract={SimpleContract} />} />
        <Route path="/proposal/:id" element={<Proposal SimpleContract={SimpleContract} />} />
      </Routes>
    </Router>
  );
};


export default App;
