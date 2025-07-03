import { apiClient } from '../client.js';
import { useAppStore } from '@store/useAppStore';

const getSelectedMCPInfo = () => {
  const state = useAppStore.getState();
  const { selectedServers, selectedTools } = state.mcpSelection;
  
  return {
    selected_servers: Array.from(selectedServers),
    selected_tools: Array.from(selectedTools)
  };
};

/**
 * 스트리밍 채팅 메시지 전송
 * @param {Object} chatData - 채팅 데이터
 * @param {Function} onChunk - 스트림 청크 수신 콜백
 * @param {Function} onComplete - 완료 콜백
 * @param {Function} onError - 에러 콜백
 * @returns {Promise<void>}
 */
export const sendStreamChatMessage = async (chatData, onChunk, onComplete, onError) => {
  try {
    console.log('[chat/endpoints] sendStreamChatMessage:', chatData);
    
    // 선택된 MCP 정보 가져오기
    const mcpInfo = getSelectedMCPInfo();
    console.log('[chat/endpoints] Selected MCP info for streaming:', mcpInfo);
    
    const response = await fetch(`${apiClient.defaults.baseURL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: chatData.message,
        session_id: chatData.session_id,
        ...mcpInfo
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete?.();
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.trim() && line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            onChunk?.(data);
          } catch (e) {
            console.warn('Failed to parse SSE data:', line);
          }
        }
      }
    }
  } catch (error) {
    console.error('[chat/endpoints] sendStreamChatMessage error:', error);
    onError?.(error.message || 'Failed to send streaming message');
  }
};