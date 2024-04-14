// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract DAO {
    enum ProposalStatus { Open, Rejected, Adopted, Fail }

    struct Proposal {
        uint256 id;
        address proposer;
        string name;
        string description;
        uint256 createTime;
        uint256 duration;
        ProposalStatus status;
        mapping(address => bool) hasVoted;
        uint256 yesVotes;
        uint256 noVotes;
    }

    Proposal[] public proposals;
    uint256 public proposalCount;

    function createProposal(
        string memory _name,
        string memory _description,
        uint256 _duration
    ) external {
        require(_duration > 0, "Duration should be greater than zero");

        Proposal storage newProposal = proposals.push();
        newProposal.id = proposalCount;
        newProposal.proposer = msg.sender;  // Set proposer to the address that calls the function
        newProposal.name = _name;
        newProposal.description = _description;
        newProposal.createTime = block.timestamp;
        newProposal.duration = _duration;
        newProposal.status = ProposalStatus.Open;

        proposalCount++;
    }

    function vote(uint256 _proposalId, bool _vote) external {
        require(_proposalId < proposalCount, "Invalid proposal ID");

        Proposal storage proposal = proposals[_proposalId];

        // Check if the voting period has ended
        if (block.timestamp >= proposal.createTime + proposal.duration) {
            // Voting period has ended, close the proposal
            _closeProposal(proposal);
        } else {
            // Voting period is still ongoing
            require(!_hasVoted(msg.sender, _proposalId), "Address has already voted");

            proposal.hasVoted[msg.sender] = true;

            if (_vote) {
                proposal.yesVotes++;
            } else {
                proposal.noVotes++;
            }
        }
    }

    function hasVoted(address voter, uint256 _proposalId) external view returns (bool) {
        require(_proposalId < proposalCount, "Invalid proposal ID");
        return _hasVoted(voter, _proposalId);
    }

    function _hasVoted(address voter, uint256 _proposalId) internal view returns (bool) {
        Proposal storage proposal = proposals[_proposalId];
        return proposal.hasVoted[voter];
    }

    function getProposalCount() external view returns (uint256) {
        return proposalCount;
    }

    function getProposal(uint256 _proposalId)
        external
        view
        returns (
            uint256 id,
            address proposer,
            string memory name,
            string memory description,
            uint256 createTime,
            uint256 duration,
            ProposalStatus status,
            uint256 yesVotes,
            uint256 noVotes
        )
    {
        require(_proposalId < proposalCount, "Invalid proposal ID");

        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.name,
            proposal.description,
            proposal.createTime,
            proposal.duration,
            proposal.status,
            proposal.yesVotes,
            proposal.noVotes
        );
    }

    function getRangeProposals(uint256 startId, uint256 endId) external view returns (
        uint256[] memory ids,
        address[] memory proposers,
        string[] memory names,
        string[] memory descriptions,
        uint256[] memory createTimes,
        uint256[] memory durations,
        ProposalStatus[] memory statuses,
        uint256[] memory yesVotes,
        uint256[] memory noVotes
    ) {
        require(startId < endId && endId <= proposalCount, "Invalid range");

        uint256 count = endId - startId;
        ids = new uint256[](count);
        proposers = new address[](count);
        names = new string[](count);
        descriptions = new string[](count);
        createTimes = new uint256[](count);
        durations = new uint256[](count);
        statuses = new ProposalStatus[](count);
        yesVotes = new uint256[](count);
        noVotes = new uint256[](count);

        for (uint256 i = startId; i < endId; i++) {
            Proposal storage proposal = proposals[i];

            ids[i - startId] = proposal.id;
            proposers[i - startId] = proposal.proposer;
            names[i - startId] = proposal.name;
            descriptions[i - startId] = proposal.description;
            createTimes[i - startId] = proposal.createTime;
            durations[i - startId] = proposal.duration;
            statuses[i - startId] = proposal.status;
            yesVotes[i - startId] = proposal.yesVotes;
            noVotes[i - startId] = proposal.noVotes;
        }

        return (ids, proposers, names, descriptions, createTimes, durations, statuses, yesVotes, noVotes);
    }

    // Function to check if a voter has voted for a specific proposal
    function hasVotedForProposal(uint256 proposalId, address voter) external view returns (bool) {
        require(proposalId < proposals.length, "Invalid proposal ID");
        
        Proposal storage proposal = proposals[proposalId];
        return proposal.hasVoted[voter];
    }

    function getVoterVotedProposals(address voter) external view returns (uint256[] memory) {
        uint256[] memory votedProposalIds = new uint256[](proposals.length);
        uint256 count = 0;

        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].hasVoted[voter]) {
                votedProposalIds[count] = proposals[i].id;
                count++;
            }
        }

        // Resize the array to remove unused elements
        assembly {
            mstore(votedProposalIds, count)
        }

        return votedProposalIds;
    }

    function _closeProposal(Proposal storage proposal) internal {
        uint256 yesVotes = proposal.yesVotes;
        uint256 noVotes = proposal.noVotes;

        if (yesVotes > noVotes) {
            proposal.status = ProposalStatus.Adopted;
        } else if (yesVotes < noVotes) {
            proposal.status = ProposalStatus.Rejected;
        } else {
            proposal.status = ProposalStatus.Fail;
        }
    }

    function closeProposal(uint256 _proposalId) external {
        require(_proposalId < proposalCount, "Invalid proposal ID");

        Proposal storage proposal = proposals[_proposalId];

        require(block.timestamp >= proposal.createTime + proposal.duration, "Voting period hasn't ended yet");

        if (proposal.status == ProposalStatus.Open) {
            uint256 yesVotes = proposal.yesVotes;
            uint256 noVotes = proposal.noVotes;

            if (yesVotes > noVotes) {
                proposal.status = ProposalStatus.Adopted;
            } else if (yesVotes < noVotes) {
                proposal.status = ProposalStatus.Rejected;
            } else {
                proposal.status = ProposalStatus.Fail;
            }
        }
    }
}
