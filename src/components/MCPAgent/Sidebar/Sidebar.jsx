import React from 'react';
import { Server, AlertCircle } from 'lucide-react';
import { useMcpServers, useRefreshMcpServers, useDeleteMcpServer } from '@hooks/mcp';
import MCPOverview from './MCPOverview';
import MCPServerItem from './MCPServerItem';
import './Sidebar.scss';

export default function Sidebar() {
  const { data: servers, isLoading, error, refetch } = useMcpServers();
  const { mutate: refreshServers, isLoading: isRefreshing, isPending: isRefreshPending } = useRefreshMcpServers();
  const { mutate: deleteServer, isLoading: isDeleting } = useDeleteMcpServer();
  
  const actualIsRefreshing = isRefreshing || isRefreshPending;

  const handleRefresh = () => {
    refreshServers();
  };

  const handleDeleteServer = (serverId) => {
    deleteServer(serverId);
  };

  return (
    <div className="sidebar">
      <MCPOverview 
        servers={servers} 
        isLoading={isLoading} 
        error={error}
        onRefresh={handleRefresh}
        isRefreshing={actualIsRefreshing}
      />
      
      <div className="mcp-servers-list">
        {isLoading && (
          <div className="loading-state">
            <Server className="loading-icon" />
            <span>MCP 서버 목록을 불러오는 중...</span>
          </div>
        )}
        
        {error && (
          <div className="error-state">
            <AlertCircle className="error-icon" />
            <span>서버 목록을 불러올 수 없습니다</span>
            <button onClick={refetch} className="retry-button">
              다시 시도
            </button>
          </div>
        )}
        
        {servers && servers.length === 0 && !isLoading && (
          <div className="empty-state">
            <Server className="empty-icon" />
            <span>등록된 MCP 서버가 없습니다</span>
          </div>
        )}
        
        {servers && servers.length > 0 && (
          servers.map((server) => (
            <MCPServerItem key={server.id} server={server} onDeleteServer={handleDeleteServer} />
          ))
        )}
      </div>
    </div>
  );
}