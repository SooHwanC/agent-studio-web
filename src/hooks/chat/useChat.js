import { useState, useCallback, useRef } from 'react';
import { sendStreamChatMessage } from '@api/chat/endpoints';

/**
 * 채팅 기능을 위한 커스텀 훅
 * @param {Object} options - 설정 옵션
 * @param {string} [options.sessionId] - 초기 세션 ID
 * @param {boolean} [options.enableStream=false] - 스트리밍 모드 활성화
 * @returns {Object} 채팅 상태 및 함수들
 */
export const useChat = (options = {}) => {
  const {
    sessionId: initialSessionId,
    enableStream = false
  } = options;

  // 상태 관리
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: '좌측 사이드바에서 MCP 서버를 선택하고 대화를 시작하세요.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [error, setError] = useState(null);

  // refs
  const messageIdCounter = useRef(1);

  /**
   * 새로운 메시지 ID 생성
   */
  const generateMessageId = useCallback(() => {
    messageIdCounter.current += 1;
    return messageIdCounter.current;
  }, []);

  /**
   * 메시지 추가
   */
  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, {
      ...message,
      id: message.id || generateMessageId(),
      timestamp: message.timestamp || new Date().toLocaleTimeString()
    }]);
  }, [generateMessageId]);

  /**
   * 스트리밍 메시지 업데이트
   */
  const updateStreamingMessage = useCallback((messageId, content) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: content }
        : msg
    ));
  }, []);

  /**
   * 스트리밍 채팅 메시지 전송
   */
  const sendMessage = useCallback(async (messageContent) => {
    if (!messageContent.trim()) return;

    setError(null);
    setIsLoading(true);

    // 사용자 메시지 추가
    const userMessage = {
      id: generateMessageId(),
      type: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString()
    };
    addMessage(userMessage);

    const agentMessageId = generateMessageId();
    const agentMessage = {
      id: agentMessageId,
      type: 'agent',
      content: '',
      timestamp: new Date().toLocaleTimeString(),
      isStreaming: true
    };
    addMessage(agentMessage);

    // 스트리밍 컨텐츠 누적용
    let accumulatedContent = '';

    try {
      await sendStreamChatMessage(
        {
          message: messageContent,
          session_id: sessionId
        },
        // onChunk
        (chunk) => {
          if (chunk.content) {
            // 개별 문자를 누적해서 업데이트
            accumulatedContent += chunk.content;
            updateStreamingMessage(agentMessageId, accumulatedContent);
          }
        },
        // onComplete
        () => {
          console.log('Streaming completed');
          setMessages(prev => prev.map(msg => 
            msg.id === agentMessageId 
              ? { ...msg, isStreaming: false }
              : msg
          ));
          setIsLoading(false);
        },
        // onError
        (error) => {
          console.error('Streaming error:', error);
          setError(error);
          setIsLoading(false);
          
          // 에러 메시지로 업데이트
          updateStreamingMessage(agentMessageId, `오류가 발생했습니다: ${error}`);
          setMessages(prev => prev.map(msg => 
            msg.id === agentMessageId 
              ? { ...msg, isStreaming: false, isError: true }
              : msg
          ));
        }
      );
    } catch (error) {
      console.error('Failed to send streaming message:', error);
      setError(error.message);
      setIsLoading(false);
    }
  }, [sessionId, generateMessageId, addMessage, updateStreamingMessage]);

  /**
   * 채팅 초기화
   */
  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 1,
        type: 'system',
        content: '새로운 대화가 시작되었습니다.',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setSessionId(null);
    setError(null);
    messageIdCounter.current = 1;
  }, []);

  /**
   * 에러 초기화
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 상태
    messages,
    isLoading,
    sessionId,
    error,
    
    // 함수
    sendMessage,
    clearChat,
    clearError,
    addMessage,
    
    // 설정
    enableStream
  };
};