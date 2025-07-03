import React from 'react';
import { Bot } from 'lucide-react';

export default function Message({ message }) {
  return (
    <div className={`message-wrapper ${message.type}`}>
      <div className={`message ${message.type} ${message.isStreaming ? 'streaming' : ''}`}>
        {message.type === 'agent' && (
          <div className="message-header">
            <Bot className="agent-icon" />
            <span className="agent-name">LLM Agent</span>
            {message.isStreaming && (
              <span className="streaming-indicator">답변 생성 중...</span>
            )}
            {message.tools && (
              <div className="tools-used">
                {message.tools.map((tool, idx) => (
                  <span key={idx} className="tool-tag">
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="message-content">
          {message.content}
          {message.isStreaming && (
            <span className="typing-cursor">|</span>
          )}
        </div>
        <div className="message-timestamp">{message.timestamp}</div>
      </div>
    </div>
  );
}