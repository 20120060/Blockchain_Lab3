import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatTimestamp, TimestampToTime } from '../utils/timestampFormatter';
import { getStatusString, getStatusColor } from '../utils/proposalStatus';
import '../styles/Proposal.css';

const Proposal = ({ SimpleContract }) => {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        // Call the getProposal function to retrieve details of the specific proposal
        const result = await SimpleContract.methods.getProposal(id).call();

        // Extract proposal details from the result
        const proposalData = {
          id: parseInt(result[0]),
          proposer: result[1],
          name: result[2],
          description: result[3],
          createTime: parseInt(result[4]),
          duration: parseInt(result[5]),
          status: result[6],
          yesVotes: parseInt(result[7]),
          noVotes: parseInt(result[8]),
        };

        setProposal(proposalData);
      } catch (error) {
        console.error('Error fetching proposal details:', error);
      }
    };
    // Call the fetchProposal function
    fetchProposal();
  }, [SimpleContract, id]);

  const handleVoteYes = async (e) => {
    try {
      // Assuming SimpleContract has a createProposal function
      e.preventDefault();
      const accounts = await window.ethereum.enable();
      const account = accounts[0];

      const check = await SimpleContract.methods.hasVoted(account, proposal.id).call();
      console.log('Check:', check);
      // Check the result status
      if (remainingTime === 0) {
        setMessage('Proposal is closed!');
        return;
      }
      if (check === false) {
        //const gas = await SimpleContract.methods.vote(proposal.id, 1).estimateGas();
        await SimpleContract.methods.vote(proposal.id, 1).send({ from: account, gas: BigInt(5000000) });
        setMessage('Vote yes successfully!');

        setProposal((prevProposal) => ({
          ...prevProposal,
          yesVotes: prevProposal.yesVotes + 1,
        }));
      } else {
        setMessage('You already voted!');
      }

    } catch (error) {
      console.error('Error voting proposal:', error);
      setMessage('Error voting proposal. Please try again.');
    }
  };

  const handleVoteNo = async (e) => {
    try {
      // Assuming SimpleContract has a createProposal function
      e.preventDefault();
      const accounts = await window.ethereum.enable();
      const account = accounts[0];

      const check = await SimpleContract.methods.hasVoted(account, proposal.id).call();
      console.log('Check:', check);
      // Check the result status
      if (remainingTime === 0) {
        setMessage('Proposal is closed!');
        return;
      }
      if (check === false) {
        //const gas = await SimpleContract.methods.vote(proposal.id, 0).estimateGas();
        await SimpleContract.methods.vote(proposal.id, 0).send({ from: account, gas: BigInt(5000000) });
        setMessage('Vote no successfully!');

        setProposal((prevProposal) => ({
          ...prevProposal,
          noVotes: prevProposal.noVotes + 1,
        }));
      } else {
        setMessage('You already voted!');
      }

    } catch (error) {
      console.error('Error voting proposal:', error);
      setMessage('Error voting proposal. Please try again.');
    }
  };

  const handleStatus = async (e) => {
    console.log(id);
    try {
      // Assuming SimpleContract has a createProposal function
      e.preventDefault();
      const accounts = await window.ethereum.enable();
      const account = accounts[0];

      //const gas = await SimpleContract.methods.closeProposal(proposal.id).estimateGas();
      //console.log('Gas:', gas);
      await SimpleContract.methods.closeProposal(proposal.id).send({ from: account, gas:  BigInt(5000000) });

      window.location.reload();

    } catch (error) {
      console.error('Error voting proposal:', error);
      window.location.reload();

    }
  };
  const calculateRemainingTime = (duration) => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const proposalEndTime = proposal.createTime + duration;
    const remainingTime = proposalEndTime - currentTime;

    return Math.max(0, remainingTime);
  };
  if (!proposal) {
    // You can render a loading state here
    return <p>Loading...</p>;
  }

  const remainingTime = calculateRemainingTime(proposal.duration);

  return (
    <div className="voteProposal">
      <p>Proposal ID: {proposal.id}</p>
      <h1>{proposal.name}</h1>
      <p>Description: {proposal.description}</p>
      <p>Create time: {formatTimestamp(proposal.createTime.toString())}</p>
      <p>Time left: {TimestampToTime(remainingTime.toString())}</p>
      <div>
        <p style={{ display: 'inline', marginRight: '10px' }}>Status:</p>
        <p style={{ display: 'inline', color: getStatusColor(parseInt(proposal.status)) }}>
          {getStatusString(parseInt(proposal.status))}
        </p>
      </div>

      <p>Proposer: {proposal.proposer}</p>

      <div className="vote-display">
        {/* Container for Yes Votes and Vote Yes button */}
        <div className="vote-container">
          <p>
            <span role="img" aria-label="Yes Votes">
              👍
            </span>{' '}
            {proposal.yesVotes} Yes Votes
          </p>
          <button className="vote-button-yes" onClick={handleVoteYes}>
            Vote Yes
          </button>
        </div>

        {/* Container for No Votes and Vote No button */}
        <div className="vote-container">
          <p>
            <span role="img" aria-label="No Votes">
              👎
            </span>{' '}
            {proposal.noVotes} No Votes
          </p>
          <button className="vote-button-no" onClick={handleVoteNo}>
            Vote No
          </button>
        </div>
      </div>
      <button className="refresh-button" onClick={handleStatus}>
        Check status manually
      </button>
      {message && <p className="message">{message}</p>}

    </div>
  );
};

export default Proposal;
