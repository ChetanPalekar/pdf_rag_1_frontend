import React from 'react';
import { Brain, Wifi, WifiOff } from 'lucide-react';

const Header = ({ isConnected }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Brain size={32} className="logo-icon" />
          <h1>RAG Assistant</h1>
        </div>
        
        <div className="connection-status">
          {isConnected ? (
            <div className="status connected">
              <Wifi size={16} />
              <span>Connected</span>
            </div>
          ) : (
            <div className="status disconnected">
              <WifiOff size={16} />
              <span>Disconnected</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 