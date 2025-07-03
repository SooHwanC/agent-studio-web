import React, { useState } from 'react';
import { Settings, Bot } from 'lucide-react';
import ConnectionModal from './ConnectionModal';
import './Header.scss';

export default function Header({ isConnected, onConnect }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <Bot className="logo-icon" />
          </div>
          <div className="title-section">
            <h1 className="main-title">MCP LLM Agent</h1>
            <p className="subtitle">MCP 서버 연동 테스트 환경</p>
          </div>
        </div>
        
        <div className="header-right">
          <div className="connection-status">
            <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
            {isConnected ? (
              <span className="status-text">MCP 서버 연결됨</span>
            ) : (
              <button 
                className="connect-button" 
                onClick={() => setIsModalOpen(true)}
              >
                MCP 서버 연결하기
              </button>
            )}
          </div>
          <button className="settings-button">
            <Settings className="settings-icon" />
          </button>
        </div>
      </div>

      <ConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={onConnect}
      />
    </div>
  );
}