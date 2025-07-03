export const createMCPSelectionSlice = (set, get) => ({
  mcpSelection: {
    selectedServers: new Set(),
    selectedTools: new Set(),
  },

  // 서버 선택/해제
  toggleServerSelection: (serverId, serverTools) => {
    set((state) => {
      const newSelectedServers = new Set(state.mcpSelection.selectedServers);
      const newSelectedTools = new Set(state.mcpSelection.selectedTools);

      if (newSelectedServers.has(serverId)) {
        // 서버 해제 - 해당 서버의 모든 도구도 해제
        newSelectedServers.delete(serverId);
        serverTools?.forEach(tool => {
          newSelectedTools.delete(tool.id);
        });
      } else {
        // 서버 선택 - 해당 서버의 모든 도구도 선택
        newSelectedServers.add(serverId);
        serverTools?.forEach(tool => {
          newSelectedTools.add(tool.id);
        });
      }

      // localStorage에 저장
      localStorage.setItem('mcp_selected_servers', JSON.stringify([...newSelectedServers]));
      localStorage.setItem('mcp_selected_tools', JSON.stringify([...newSelectedTools]));

      return {
        mcpSelection: {
          ...state.mcpSelection,
          selectedServers: newSelectedServers,
          selectedTools: newSelectedTools,
        }
      };
    });
  },

  // 개별 도구 선택/해제
  toggleToolSelection: (toolId) => {
    set((state) => {
      const newSelectedTools = new Set(state.mcpSelection.selectedTools);

      if (newSelectedTools.has(toolId)) {
        newSelectedTools.delete(toolId);
      } else {
        newSelectedTools.add(toolId);
      }

      // localStorage에 저장
      localStorage.setItem('mcp_selected_tools', JSON.stringify([...newSelectedTools]));

      return {
        mcpSelection: {
          ...state.mcpSelection,
          selectedTools: newSelectedTools,
        }
      };
    });
  },

  // 전체 서버 선택
  selectAllServers: (servers) => {
    set((state) => {
      const allServerIds = new Set(servers?.map(s => s.id) || []);
      const allToolIds = new Set();
      
      servers?.forEach(server => {
        server.tools?.forEach(tool => {
          allToolIds.add(tool.id);
        });
      });

      // localStorage에 저장
      localStorage.setItem('mcp_selected_servers', JSON.stringify([...allServerIds]));
      localStorage.setItem('mcp_selected_tools', JSON.stringify([...allToolIds]));

      return {
        mcpSelection: {
          ...state.mcpSelection,
          selectedServers: allServerIds,
          selectedTools: allToolIds,
        }
      };
    });
  },

  // 전체 선택 해제
  clearAllSelections: () => {
    set((state) => {
      // localStorage에서 제거
      localStorage.removeItem('mcp_selected_servers');
      localStorage.removeItem('mcp_selected_tools');

      return {
        mcpSelection: {
          ...state.mcpSelection,
          selectedServers: new Set(),
          selectedTools: new Set(),
        }
      };
    });
  },

  // localStorage에서 선택 상태 복원
  loadMCPSelections: () => {
    try {
      const savedServers = localStorage.getItem('mcp_selected_servers');
      const savedTools = localStorage.getItem('mcp_selected_tools');
      
      const selectedServers = savedServers ? new Set(JSON.parse(savedServers)) : new Set();
      const selectedTools = savedTools ? new Set(JSON.parse(savedTools)) : new Set();

      set((state) => ({
        mcpSelection: {
          ...state.mcpSelection,
          selectedServers,
          selectedTools,
        }
      }));
    } catch (error) {
      console.error('Failed to load MCP selections:', error);
    }
  },
});