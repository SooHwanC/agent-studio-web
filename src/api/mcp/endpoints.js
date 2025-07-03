import { apiClient } from '../client.js';

/**
 * MCP 서버 목록 조회 (툴 정보 포함)
 * @returns {Promise<Array>} MCP 서버 목록
 */
export const getMcpServers = async () => {
  try {
    const response = await apiClient.get('/mcp-servers/with-tools');
    console.log("[mcp/endpoints] getMcpServers response", response);
    return response.data; 
  } catch (error) {
    console.error("[mcp/endpoints] getMcpServers error", error);
    throw new Error(error.response?.data?.message || 'Failed to fetch MCP servers');
  }
};

/**
 * 특정 MCP 서버의 툴 목록 조회
 * @param {string|number} serverId - 서버 ID
 * @returns {Promise<Array>} 툴 목록
 */
export const getMcpServerTools = async (serverId) => {
  try {
    console.log(`[mcp/endpoints] getMcpServerTools for server ${serverId}`);
    const response = await apiClient.get(`/mcp-servers/${serverId}/tools`);
    return response.data;
  } catch (error) {
    console.error(`[mcp/endpoints] getMcpServerTools error for server ${serverId}`, error);
    throw new Error(error.response?.data?.message || 'Failed to fetch MCP server tools');
  }
};

/**
 * MCP 서버 삭제
 * @param {string|number} serverId - 서버 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteMcpServer = async (serverId) => {
  try {
    console.log(`[mcp/endpoints] deleteMcpServer for server ${serverId}`);
    const response = await apiClient.delete(`/mcp-servers/${serverId}`);
    return response.data;
  } catch (error) {
    console.error(`[mcp/endpoints] deleteMcpServer error for server ${serverId}`, error);
    throw new Error(error.response?.data?.message || 'Failed to delete MCP server');
  }
};

/**
 * MCP 서버 생성
 * @param {Object} serverData - 서버 생성 데이터
 * @returns {Promise<Object>} 생성된 서버 정보
 */
export const createMcpServer = async (serverData) => {
  try {
    console.log("[mcp/endpoints] createMcpServer", serverData);
    const response = await apiClient.post('/mcp-servers', serverData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("[mcp/endpoints] createMcpServer error", error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create MCP server'
    };
  }
};

/**
 * MCP 서버 업데이트
 * @param {string|number} serverId - 서버 ID
 * @param {Object} updateData - 업데이트할 데이터
 * @returns {Promise<Object>} 업데이트된 서버 정보
 */
export const updateMcpServer = async (serverId, updateData) => {
  try {
    console.log(`[mcp/endpoints] updateMcpServer for server ${serverId}`, updateData);
    const response = await apiClient.put(`/mcp-servers/${serverId}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`[mcp/endpoints] updateMcpServer error for server ${serverId}`, error);
    throw new Error(error.response?.data?.message || 'Failed to update MCP server');
  }
};

/**
 * MCP 서버 리프래시
 * @returns {Promise<Object>} 리프래시 결과
 */
export const refreshMcpServers = async () => {
  try {
    console.log("[mcp/endpoints] refreshMcpServers");
    const response = await apiClient.post('/mcp-servers/refresh');
    console.log("[mcp/endpoints] refreshMcpServers response", response);
    return response.data;
  } catch (error) {
    console.error("[mcp/endpoints] refreshMcpServers error", error);
    throw new Error(error.response?.data?.message || 'Failed to refresh MCP servers');
  }
};