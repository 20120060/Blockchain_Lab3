import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Card.css';
import { formatTimestamp } from '../utils/timestampFormatter';
import { getStatusString, getStatusColor } from '../utils/proposalStatus';


const VotedProposals = ({ SimpleContract }) => {
    const navigate = useNavigate();
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [voterAddress, setVoterAddress] = useState('');

    const fetchProposals = async (address) => {
        try {
            const proposalCount = await SimpleContract.methods
                .getVoterVotedProposals(address)
                .call();
            console.log(proposalCount);

            if (proposalCount[0] === null) {
                console.error('Proposals data is null');
                setLoading(false);
                return;
            }
            const proposals = [];
            for (let i = 0; i < proposalCount.length; i++) {
                const result = await SimpleContract.methods
                    .getProposal(proposalCount[i])
                    .call();

                console.log(result);

                const proposal = {
                    id: result[0], // Adjust the index based on the actual structure of result
                    proposer: result[1],
                    name: result[2],
                    description: result[3],
                    createTime: result[4],
                    duration: result[5],
                    status: result[6],
                    yesVotes: result[7],
                    noVotes: result[8],
                };
                proposals.push(proposal);
            }

            setProposals(proposals.reverse());
            setLoading(false);
        } catch (error) {
            console.error('Error fetching proposals:', error);
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        const address = event.target.value;
        setVoterAddress(address);
    };

    const handleSearchButtonClick = () => {
        fetchProposals(voterAddress);
    };

    const handleClick = (proposalId) => {
        // Navigate to the proposal page with the proposal's ID
        navigate(`/proposal/${proposalId}`);
    };

    return (
        <div className="align-items">
            <div className="search-container">
                <label htmlFor="voterAddress" className="search-label">
                    Enter Voter Address:
                </label>
                <input
                    type="text"
                    id="voterAddress"
                    value={voterAddress}
                    onChange={handleSearch}
                    className="search-input"
                />
                <button onClick={handleSearchButtonClick} className="create-proposal-button">
                    Search
                </button>
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

export default VotedProposals;
