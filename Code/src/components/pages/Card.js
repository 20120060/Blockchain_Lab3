import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Card.css';
import { formatTimestamp } from '../utils/timestampFormatter';
import { getStatusString, getStatusColor } from '../utils/proposalStatus';

const Card = ({ SimpleContract }) => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define a function to fetch proposals
    const fetchProposals = async () => {
      try {
        // Get the total number of proposals
        const proposalCount = await SimpleContract.methods.getProposalCount().call();

        // Get proposals in a specific range (e.g., 0 to proposalCount)
        const startId = 0;
        const endId = proposalCount;
        const result = await SimpleContract.methods.getRangeProposals(startId, endId).call();

        // Check if proposalsData is null
        if (result[0] === null) {
          // Handle the case when proposalsData is null
          console.error('Proposals data is null');
          setLoading(false); // Set loading to false since we attempted to fetch data
          return;
        }

        // Extract the proposals from the result
        const proposalsData = result[0].map((id, index) => ({
          id,
          proposer: result[1][index],
          name: result[2][index],
          description: result[3][index],
          createTime: result[4][index],
          duration: result[5][index],
          status: result[6][index],
          yesVotes: result[7][index],
          noVotes: result[8][index],
        }));

        setProposals(proposalsData.reverse()); // Reverse the array before setting it
        setLoading(false); // Set loading to false when data is successfully fetched
      } catch (error) {
        console.error('Error fetching proposals:', error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    // Call the fetchProposals function
    fetchProposals();
  }, [SimpleContract]);

  const handleClick = (proposalId) => {
    // Navigate to the proposal page with the proposal's ID
    navigate(`/proposal/${proposalId}`);
  };
  const handleCreateProposal = () => {
    // Navigate to the CreateProposal page
    navigate('/new-proposal');
  };
  const handleVotedProposals = () => {
    // Navigate to the CreateProposal page
    navigate('/voted-proposals');
  };
  return (
    <div className="align-items">
      <div>
        <button onClick={handleCreateProposal} className="create-proposal-button">Create Proposal</button>
        <button onClick={handleVotedProposals} className="create-proposal-button">Voted Proposals</button>
      </div>
      <div className="card-container">
        {loading && <p className='message'>Loading proposals...</p>}
        {!loading && proposals.length === 0 && <p>There are no proposals yet.</p>}
        {!loading &&
          proposals.map((proposal) => (
            <div className="card" key={proposal.id} onClick={() => handleClick(proposal.id)}>
              <div className="info-line">
                <p className="id">ID: {proposal.id.toString()}</p>
                <p className="status" style={{ color: getStatusColor(parseInt(proposal.status)) }}>
                  {getStatusString(parseInt(proposal.status))}
                </p>
              </div>
              <h2 className="name">{proposal.name}</h2>
              <p className="description"> "{proposal.description}"</p>
              <p className="time">Time: {formatTimestamp(proposal.createTime.toString())}</p>
              <p className="proposer">From: {proposal.proposer}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Card;
