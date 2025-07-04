import React from 'react';
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 마크다운 표 패턴 감지 함수
const isMarkdownTable = (text) => {
  const lines = text.split('\n');
  return lines.some(line => 
    line.includes('|') && 
    line.split('|').length >= 3 &&
    lines.some(l => l.includes('---') || l.includes(':-'))
  );
};

// 코드 블록 내 마크다운 표 처리 함수
const processContent = (content) => {
  // 코드 블록 패턴 찾기
  const codeBlockPattern = /```(?:markdown)?\n([\s\S]*?)\n```/g;
  
  return content.replace(codeBlockPattern, (match, code) => {
    // 코드 블록 내용이 마크다운 표인지 확인
    if (isMarkdownTable(code.trim())) {
      // 마크다운 표면 코드 블록에서 빼내서 직접 렌더링
      return '\n' + code.trim() + '\n';
    }
    // 마크다운 표가 아니면 원본 코드 블록 유지
    return match;
  });
};

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
                  
                  // 코드 블록 내용이 마크다운 표인지 확인
                  const codeContent = String(children);
                  if (isMarkdownTable(codeContent)) {
                    return (
                      <div className="embedded-table">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                          table: ({ node, ...props }) => (
                            <div className="table-wrapper">
                              <table {...props} />
                            </div>
                          ),
                        }}>
                          {codeContent}
                        </ReactMarkdown>
                      </div>
                    );
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
              {processContent(message.content)}
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