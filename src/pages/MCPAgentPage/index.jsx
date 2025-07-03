import React, { useState } from 'react';
import Header from '@components/MCPAgent/Header/Header';
import Sidebar from '@components/MCPAgent/Sidebar/Sidebar';
import ChatContainer from '@components/MCPAgent/Chat/ChatContainer';
import './MCPAgentPage.scss';

export default function MCPAgent() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="mcp-agent-container">
      <Header isConnected={isConnected} />
      
      <div className="main-content">
        <div className="layout-grid">
          <Sidebar />
          <ChatContainer />
        </div>
      </div>
    </div>
  );
}