import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useAppStore } from '@store/useAppStore';

const MCPOverview = ({ servers, isLoading, error, onRefresh, isRefreshing }) => {
  const mcpSelection = useAppStore((state) => state.mcpSelection);
  const { selectAllServers, clearAllSelections, loadMCPSelections } = useAppStore();

  const getSelectedToolsCount = () => mcpSelection.selectedTools.size;
  const getSelectedServersCount = () => mcpSelection.selectedServers.size;

  // 컴포넌트 마운트시 저장된 선택 상태 복원
  useEffect(() => {
    loadMCPSelections();
  }, [loadMCPSelections]);

  if (isLoading) {
    return (
      <div className="mcp-overview">
        <div className="overview-header">
          <h3 className="overview-title">MCP 서버 현황</h3>
          <button 
            className="refresh-button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="서버 목록 새로고침"
          >
            <RefreshCw 
              size={16} 
              className={isRefreshing ? 'refreshing' : ''} 
            />
          </button>
        </div>
        <div className="overview-loading">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mcp-overview">
        <div className="overview-header">
          <h3 className="overview-title">MCP 서버 현황</h3>
          <button 
            className="refresh-button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="서버 목록 새로고침"
          >
            <RefreshCw 
              size={16} 
              className={isRefreshing ? 'refreshing' : ''} 
            />
          </button>
        </div>
        <div className="overview-error">
          <AlertCircle size={16} />
          <span>데이터를 불러올 수 없습니다</span>
        </div>
      </div>
    );
  }

  const connectedCount = servers?.filter(server => server.status === 'active').length || 0;
  const totalServers = servers?.length || 0;

  // 활성 서버만 필터링 (전체 선택에서 사용)
  const activeServers = servers?.filter(server => server.status === 'active') || [];

  const handleSelectAllActiveServers = () => {
    // 활성 서버만 선택
    selectAllServers(activeServers);
  };

  return (
    <div className="mcp-overview">
      <div className="overview-header">
        <h3 className="overview-title">MCP 서버 현황</h3>
        <button 
          className="refresh-button"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="서버 목록 새로고침"
        >
          <RefreshCw 
            size={16} 
            className={isRefreshing ? 'refreshing' : ''} 
          />
        </button>
      </div>
      
      <div className="overview-stats">
        <div className="overview-stat">
          <span className="stat-number connected">{connectedCount}</span>
          <span className="stat-description">연결된 서버</span>
        </div>
        <div className="overview-stat">
          <span className="stat-number">{totalServers}</span>
          <span className="stat-description">전체 서버</span>
        </div>
      </div>
      
      {/* 선택 현황 표시 */}
      <div className="selection-summary">
        <div className="selection-stats">
          <div className="selection-stat">
            <span className="selection-number">{getSelectedServersCount()}</span>
            <span className="selection-label">선택된 서버</span>
          </div>
          <div className="selection-stat">
            <span className="selection-number primary">{getSelectedToolsCount()}</span>
            <span className="selection-label">선택된 도구</span>
          </div>
        </div>
        
        {/* 전체 선택/해제 버튼 */}
        {activeServers.length > 0 && (
          <div className="selection-controls">
            <button 
              className="selection-button"
              onClick={handleSelectAllActiveServers}
            >
              활성 서버 전체 선택
            </button>
            <button 
              className="selection-button"
              onClick={clearAllSelections}
            >
              전체 해제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MCPOverview;