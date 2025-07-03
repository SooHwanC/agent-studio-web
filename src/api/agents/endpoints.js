import { apiClient } from '../client.js';

// 에이전트 생성
export const createAgent = async (agentData) => {
  try {
    const response = await apiClient.post('/mcp-servers/create', agentData);
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create agent'
    }
  }
};
