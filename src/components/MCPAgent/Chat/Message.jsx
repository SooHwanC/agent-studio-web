import React from 'react';
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
          {message.type === 'agent' ? (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ node, ...props }) => (
                  <div className="table-wrapper">
                    <table {...props} />
                  </div>
                ),
                code: ({ node, inline, className, children, ...props }) => {
                  if (inline) {
                    return <code className="inline-code" {...props}>{children}</code>;
                  }
                  return (
                    <div className="code-block">
                      <pre>
                        <code {...props}>{children}</code>
                      </pre>
                    </div>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            message.content
          )}
          {message.isStreaming && (
            <span className="typing-cursor">|</span>
          )}
        </div>
        <div className="message-timestamp">{message.timestamp}</div>
      </div>
    </div>
  );
}