import React, { useState } from 'react';
import '../styles/NewProposal.css';

const NewProposal = ({ SimpleContract }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateProposal = async (e) => {
    try {
      // Perform any validation checks on the form inputs here
      if (!name || !description || !duration) {
        setMessage('Please fill out all the form fields.');
        return;
      }
      if (Number(duration) <= 0) {
        setMessage('Please enter a valid duration.');
        return;
      }

      // Assuming SimpleContract has a createProposal function
      e.preventDefault();
      const accounts = await window.ethereum.enable();
      const account = accounts[0];

      //const gas = await SimpleContract.methods.createProposal(name, description, Number(duration)).estimateGas();
      await SimpleContract.methods.createProposal(name, description, Number(duration)).send({ from: account, gas: BigInt(5000000)  });
      setMessage('Proposal created successfully!');
      // Optionally, you can reset the form after successful submission*/
      setName('');
      setDescription('');
      setDuration('');
    } catch (error) {
      console.error('Error creating proposal:', error);
      setMessage('Error creating proposal. Please try again.');
    }
  };

  return (
    <div className="createProposal">
      <h1>Create Proposal</h1>
      <form>
        <div>
          <label htmlFor="formName">Name</label>
          <input type="text" id="formName" placeholder="Enter proposal name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label htmlFor="formDescription">Description</label>
          <br></br>
          <textarea id="formDescription" rows={3} placeholder="Enter proposal description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <label htmlFor="formDuration">Duration (in seconds)</label>
          <input type="number" id="formDuration" placeholder="Enter proposal duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>

        <button type="button" onClick={handleCreateProposal}>
          Create Proposal
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default NewProposal;

