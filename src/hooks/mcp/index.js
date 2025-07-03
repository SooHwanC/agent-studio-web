import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getMcpServers, 
  getMcpServerTools, 
  deleteMcpServer, 
  createMcpServer,
  updateMcpServer,
  refreshMcpServers
} from '@api/mcp/endpoints';
import { createAgent } from '@api/agents/endpoints';
import { useAppStore } from '@store/useAppStore';

// Query Keys
export const MCP_QUERY_KEYS = {
  servers: ['mcpServers'],
  serverTools: (serverId) => ['mcpServerTools', serverId],
};

/**
 * MCP 서버 목록 조회 훅
 */
export const useMcpServers = () => {
  return useQuery({
    queryKey: MCP_QUERY_KEYS.servers,
    queryFn: getMcpServers,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error('Failed to fetch MCP servers:', error);
    }
  });
};

/**
 * 특정 MCP 서버의 툴 목록 조회 훅
 */
export const useMcpServerTools = (serverId) => {
  return useQuery({
    queryKey: MCP_QUERY_KEYS.serverTools(serverId),
    queryFn: () => getMcpServerTools(serverId),
    enabled: !!serverId, // serverId가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    onError: (error) => {
      console.error(`Failed to fetch tools for MCP server ${serverId}:`, error);
    }
  });
};

/**
 * MCP 서버 생성 훅
 */
export const useCreateMcpServer = () => {
  const queryClient = useQueryClient();
  const { setSessionId, setMcpConnection } = useAppStore();

  return useMutation({
    mutationFn: async (agentData) => {
      const result = await createAgent(agentData);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      return result.data;
    },
    onSuccess: (data, variables) => {
      console.log('MCP Server created successfully:', data);
      // 서버 목록 갱신
      queryClient.invalidateQueries(MCP_QUERY_KEYS.servers);
    },
    onError: (error, variables) => {
      console.error('Failed to create MCP server:', error);
    },
  });
};

/**
 * 새로운 MCP 서버 생성 훅 (순수 MCP API 사용)
 */
export const useCreateMcpServerDirect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMcpServer,
    onSuccess: (data) => {
      console.log('MCP Server created successfully:', data);
      // 서버 목록 갱신
      queryClient.invalidateQueries(MCP_QUERY_KEYS.servers);
    },
    onError: (error) => {
      console.error('Failed to create MCP server:', error);
    },
  });
};

/**
 * MCP 서버 업데이트 훅
 */
export const useUpdateMcpServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serverId, updateData }) => updateMcpServer(serverId, updateData),
    onSuccess: (data, { serverId }) => {
      console.log(`MCP Server ${serverId} updated successfully:`, data);
      // 관련 쿼리들 갱신
      queryClient.invalidateQueries(MCP_QUERY_KEYS.servers);
      queryClient.invalidateQueries(MCP_QUERY_KEYS.serverTools(serverId));
    },
    onError: (error, { serverId }) => {
      console.error(`Failed to update MCP server ${serverId}:`, error);
    },
  });
};

/**
 * MCP 서버 삭제 훅
 */
export const useDeleteMcpServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMcpServer,
    onSuccess: (data, serverId) => {
      console.log(`MCP Server ${serverId} deleted successfully:`, data);
      // 서버 목록 갱신
      queryClient.invalidateQueries(MCP_QUERY_KEYS.servers);
      // 해당 서버의 툴 정보 캐시 제거
      queryClient.removeQueries(MCP_QUERY_KEYS.serverTools(serverId));
    },
    onError: (error, serverId) => {
      console.error(`Failed to delete MCP server ${serverId}:`, error);
    },
  });
};

/**
 * MCP 서버 리프래시 훅
 */
export const useRefreshMcpServers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshMcpServers,
    onSuccess: (data) => {
      console.log('MCP servers refreshed successfully:', data);
      // 서버 목록 갱신
      queryClient.invalidateQueries(MCP_QUERY_KEYS.servers);
      // 모든 서버 툴 정보도 갱신
      queryClient.invalidateQueries(['mcpServerTools']);
    },
    onError: (error) => {
      console.error('Failed to refresh MCP servers:', error);
    },
  });
};


/**
 * 모든 MCP 관련 쿼리 무효화
 */
export const useInvalidateMcpQueries = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries(MCP_QUERY_KEYS.servers);
    queryClient.invalidateQueries(['mcpServerTools']);
  };
};