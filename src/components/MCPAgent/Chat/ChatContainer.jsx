import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Bot } from 'lucide-react';
import { useChat } from '@hooks/chat/useChat';
import Message from './Message';
import MessageInput from './MessageInput';
import './ChatContainer.scss';

// 랜덤 세션 ID 생성 함수
const generateSessionId = () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000000);
  return `mcp-chat-session-${timestamp}-${randomNum}`;
};

export default function ChatContainer() {
  const [inputMessage, setInputMessage] = useState('');
  const [currentSessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    error,
    sessionId
  } = useChat({
    sessionId: currentSessionId,
    enableStream: true
  });

  // 스크롤을 맨 아래로 이동하는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  // 메시지가 변경될 때마다 스크롤 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 스트리밍 중인 메시지가 있을 때 주기적으로 스크롤 이동
  useEffect(() => {
    const streamingMessage = messages.find(msg => msg.isStreaming);
    if (streamingMessage) {
      const interval = setInterval(() => {
        scrollToBottom();
      }, 100); // 100ms마다 스크롤 체크

      return () => clearInterval(interval);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    sendMessage(inputMessage);
    setInputMessage('');
    
    // 메시지 전송 후 약간의 지연을 두고 스크롤 이동
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  };

  // 세션 ID를 짧게 표시하기 위한 함수
  const getShortSessionId = (fullSessionId) => {
    if (!fullSessionId) return '';
    return fullSessionId.slice(-8);
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="chat-title-section">
            <MessageSquare className="chat-icon" />
            <h2 className="chat-title">Agent 대화</h2>
          </div>
          <div className="chat-info">
            <div className="message-count">
              {messages.length - 1}개 메시지
            </div>
            <div className="session-info">
              세션: {getShortSessionId(sessionId || currentSessionId)}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container" ref={messagesContainerRef}>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {/* 스크롤 타겟 요소 */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}