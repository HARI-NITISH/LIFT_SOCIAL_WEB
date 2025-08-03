import React from 'react';
import './MyNetwork.css';

const MyNetwork = () => {
  return (
    <div className="my-network">
      <div className="network-container">
        <h1>My Network</h1>
        <p>Connect with other fitness enthusiasts and build your network!</p>
        
        <div className="network-content">
          <div className="network-section">
            <h2>Find Connections</h2>
            <p>Discover people with similar fitness goals and interests.</p>
          </div>
          
          <div className="network-section">
            <h2>Your Connections</h2>
            <p>View and manage your existing network connections.</p>
          </div>
          
          <div className="network-section">
            <h2>Suggested Connections</h2>
            <p>People you might want to connect with based on your activity.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNetwork;
