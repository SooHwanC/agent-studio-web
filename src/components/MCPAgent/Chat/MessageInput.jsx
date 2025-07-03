import React, { useRef } from 'react';
import { Send } from 'lucide-react';

export default function MessageInput({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage, 
  isLoading 
}) {
  const isSubmittingRef = useRef(false);

  const handleSend = () => {
    // 중복 전송 방지
    if (isSubmittingRef.current || isLoading || !inputMessage.trim()) {
      return;
    }
    
    console.log('MessageInput: Sending message');
    isSubmittingRef.current = true;
    
    try {
      onSendMessage();
    } finally {
      // 짧은 지연 후 플래그 해제
      setTimeout(() => {
        isSubmittingRef.current = false;
      }, 200);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 기본 줄바꿈 방지
      handleSend();
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="input-container">
      <div className="input-wrapper">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="MCP Agent에게 질문하거나 명령을 입력하세요..."
          className="message-input"
          rows="2"
          disabled={isLoading}
        />
        <button
          onClick={handleButtonClick}
          disabled={!inputMessage.trim() || isLoading}
          className="send-button"
          type="button"
        >
          <Send className="send-icon" />
          <span>전송</span>
        </button>
      </div>
      <div className="input-help">
        <span>Enter로 전송, Shift+Enter로 줄바꿈</span>
        <span>{inputMessage.length}/1000</span>
      </div>
    </div>
  );
}