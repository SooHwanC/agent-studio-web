import React, { useState } from 'react';
import { Server, Zap, ChevronDown, ChevronRight, Circle, AlertCircle, Code, Info, Check, Trash2 } from 'lucide-react';
import { useAppStore } from '@store/useAppStore';
import SchemaDisplay from './SchemaDisplay';

const MCPServerItem = ({ server, onDeleteServer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedTools, setExpandedTools] = useState({});
  
  const mcpSelection = useAppStore((state) => state.mcpSelection);
  const {
    toggleServerSelection,
    toggleToolSelection,
  } = useAppStore();

  const isServerSelected = (serverId) => mcpSelection.selectedServers.has(serverId);
  const isToolSelected = (toolId) => mcpSelection.selectedTools.has(toolId);
  
  // 서버 활성 상태 확인
  const isServerActive = server.status === 'active';

  const toggleToolExpansion = (toolId) => {
    setExpandedTools(prev => ({
      ...prev,
      [toolId]: !prev[toolId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'connected';
      case 'inactive': return 'disconnected';
      default: return 'pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '연결됨';
      case 'inactive': return '연결 끊김';
      default: return '연결 중';
    }
  };

  const activeToolsCount = server.tools?.filter(tool => server.status === 'active').length || 0;
  const totalToolsCount = server.tools?.length || 0;
  const selectedToolsInServer = server.tools?.filter(tool => isToolSelected(tool.id)).length || 0;

  const handleServerToggle = (e) => {
    e.stopPropagation();
    // 서버가 비활성 상태면 토글 불가
    if (!isServerActive) return;
    toggleServerSelection(server.id, server.tools);
  };

  const handleToolToggle = (e, toolId) => {
    e.stopPropagation();
    // 서버가 비활성 상태면 툴 토글 불가
    if (!isServerActive) return;
    toggleToolSelection(toolId);
  };

  const handleServerDelete = (e) => {
    e.stopPropagation();
    
    if (window.confirm(`"${server.server_name}" 서버를 삭제하시겠습니까?`)) {
      console.log('server.id', server.id);
      onDeleteServer(server.id);
    }
  };

  return (
    <div className={`mcp-server-item ${isServerSelected(server.id) ? 'selected' : ''} ${!isServerActive ? 'disabled' : ''}`}>
      <div 
        className="mcp-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mcp-info">
          <div className="mcp-title">
            <div className="server-selection">
              <div 
                className={`server-checkbox ${isServerSelected(server.id) ? 'checked' : ''} ${!isServerActive ? 'disabled' : ''}`}
                onClick={handleServerToggle}
                style={{ cursor: isServerActive ? 'pointer' : 'not-allowed' }}
              >
                {isServerSelected(server.id) && isServerActive && <Check size={12} />}
              </div>
              <Server className="mcp-icon" />
              <span className="mcp-name">{server.server_name}</span>
            </div>
          </div>
          <div className="mcp-status-row">
            <div className="mcp-status">
              <Circle className={`status-indicator ${getStatusColor(server.status)}`} />
              <span className={`status-text ${getStatusColor(server.status)}`}>
                {getStatusText(server.status)}
              </span>
            </div>
            {selectedToolsInServer > 0 && isServerActive && (
              <div className="selected-tools-badge">
                {selectedToolsInServer}개 선택됨
              </div>
            )}
          </div>
        </div>
        <div className="header-controls">
          <button 
            className="delete-button"
            onClick={handleServerDelete}
            title="서버 삭제"
          >
            <Trash2 size={14} />
          </button>
          <div className="expand-button">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mcp-details">
          <div className="mcp-stats">
            <div className="stat-item">
              <span className="stat-label">사용 가능한 툴</span>
              <span className="stat-value highlight">
                {activeToolsCount}/{totalToolsCount}개
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">전송 방식</span>
              <span className="stat-value">{server.transport_type?.toUpperCase()}</span>
            </div>
          </div>

          {server.tools && server.tools.length > 0 && (
            <div className="tools-section">
              <h4 className="tools-title">
                <Zap className="tools-icon" />
                툴 목록
              </h4>
              <div className="tools-list">
                {server.tools.map((tool) => {
                  const isToolExpanded = expandedTools[tool.id];
                  const toolSelected = isToolSelected(tool.id);
                  
                  return (
                    <div key={tool.id} className={`tool-item-enhanced ${toolSelected ? 'selected' : ''} ${!isServerActive ? 'disabled' : ''}`}>
                      <div 
                        className="tool-header"
                        onClick={() => toggleToolExpansion(tool.id)}
                      >
                        <div className="tool-info">
                          <div className="tool-main-info">
                            <div 
                              className={`tool-checkbox ${toolSelected ? 'checked' : ''} ${!isServerActive ? 'disabled' : ''}`}
                              onClick={(e) => handleToolToggle(e, tool.id)}
                              style={{ cursor: isServerActive ? 'pointer' : 'not-allowed' }}
                            >
                              {toolSelected && isServerActive && <Check size={10} />}
                            </div>
                            <span className="tool-name">{tool.tool_name}</span>
                            <div className={`tool-status ${server.status === 'active' ? 'active' : 'inactive'}`}></div>
                          </div>
                          {tool.description && (
                            <span className="tool-description">{tool.description}</span>
                          )}
                        </div>
                        <div className="tool-expand-controls">
                          {tool.input_schema && (
                            <Code className="schema-icon" size={14} />
                          )}
                          {isToolExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                      </div>

                      {isToolExpanded && (
                        <div className="tool-details">
                          {tool.input_schema ? (
                            <div className="tool-schema-section">
                              <div className="schema-header">
                                <Info size={14} />
                                <span>입력 스키마</span>
                              </div>
                              <SchemaDisplay schema={tool.input_schema} />
                            </div>
                          ) : (
                            <div className="no-schema">
                              <Info size={14} />
                              <span>입력 스키마 정보가 없습니다</span>
                            </div>
                          )}
                          
                          {tool.created_at && (
                            <div className="tool-meta">
                              <span className="meta-label">등록일:</span>
                              <span className="meta-value">
                                {new Date(tool.created_at).toLocaleDateString('ko-KR')}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(!server.tools || server.tools.length === 0) && (
            <div className="no-tools">
              <AlertCircle size={16} />
              <span>등록된 툴이 없습니다</span>
            </div>
          )}
          
          {/* 비활성 서버 안내 메시지 */}
          {!isServerActive && (
            <div className="inactive-notice">
              <AlertCircle size={16} />
              <span>서버가 비활성 상태입니다. 연결을 확인해주세요.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MCPServerItem;