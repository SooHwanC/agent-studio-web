import React, { useState } from 'react';
import { Server, AlertCircle, CheckCircle } from 'lucide-react';
import Modal from '@components/common/Modal/Modal';
import { useCreateMcpServer } from '@hooks/mcp';
import { useAppStore } from '@store/useAppStore';
import './ConnectionModal.scss';

export default function ConnectionModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    serverName: '',
    endpoint: '',
    transportType: 'sse',
    description: ''
  });
  const [error, setError] = useState('');

  const createAgentMutation = useCreateMcpServer();
  const { setConnectionInfo, generateSessionId } = useAppStore();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 사용자가 입력을 변경하면 기존 에러 메시지 제거
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.serverName.trim()) {
      setError('서버 이름을 입력해주세요.');
      return false;
    }

    if (!formData.endpoint.trim()) {
      setError('엔드포인트 URL을 입력해주세요.');
      return false;
    }

    // URL 유효성 검사
    try {
      new URL(formData.endpoint);
    } catch {
      setError('유효한 URL을 입력해주세요. (예: http://localhost:8765/sse)');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      serverName: '',
      endpoint: '',
      transportType: 'sse',
      description: ''
    });
    setError('');
  };

  const handleConnect = async () => {
    // 폼 유효성 검사
    if (!validateForm()) return;

    try {
      // 에이전트 생성 요청 데이터
      const agentData = {
        server_name: formData.serverName,
        endpoint: formData.endpoint,
        transport_type: formData.transportType,
        description: formData.description || null
      };

      console.log('[ConnectionModal] Connecting to MCP server...');
      console.log('agentData', agentData);

      // mutateAsync를 사용해서 Promise로 처리
      const result = await createAgentMutation.mutateAsync(agentData);

      console.log('[ConnectionModal] Agent created successfully:', result);

      // 성공 후 모달 닫기 및 폼 초기화
      alert('MCP 서버 연결 성공');
      resetForm();
      onClose();

    } catch (err) {
      console.error('[ConnectionModal] Connection failed:', err);
      
      // 에러 메시지 처리
      let errorMessage = 'MCP 서버 연결에 실패했습니다.';
      
      if (err.response?.data?.detail) {
        // 서버에서 반환한 상세 에러 메시지
        const detail = err.response.data.detail;
        
        if (detail.includes('connection')) {
          errorMessage = 'MCP 서버에 연결할 수 없습니다. 서버 상태와 URL을 확인해주세요.';
        } else if (detail.includes('timeout')) {
          errorMessage = '연결 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.';
        } else if (detail.includes('refused')) {
          errorMessage = '서버가 연결을 거부했습니다. 서버가 실행 중인지 확인해주세요.';
        } else {
          errorMessage = detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.request) {
        errorMessage = '네트워크 연결을 확인해주세요.';
      }
      
      setError(errorMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !createAgentMutation.isPending) {
      handleConnect();
    }
  };

  const handleClose = () => {
    if (!createAgentMutation.isPending) {
      resetForm();
      onClose();
    }
  };

  const isFormValid = formData.serverName.trim() && formData.endpoint.trim();
  const isConnecting = createAgentMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="MCP 서버 연결"
      size="medium"
    >
      <div className="connection-modal">
        <div className="connection-info">
          <div className="info-icon">
            <Server className="server-icon" />
          </div>
          <div className="info-content">
            <h3>MCP 서버에 연결하세요</h3>
            <p>MCP 서버 정보를 입력하여 Agent와 통신을 시작합니다.</p>
          </div>
        </div>

        <div className="connection-form">
          <div className="form-group">
            <label htmlFor="server-name" className="form-label">
              서버 이름 <span className="required">*</span>
            </label>
            <input
              id="server-name"
              type="text"
              value={formData.serverName}
              onChange={(e) => handleInputChange('serverName', e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="예: hr_server"
              className={`form-input ${error && !formData.serverName.trim() ? 'error' : ''}`}
              disabled={isConnecting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endpoint" className="form-label">
              엔드포인트 URL <span className="required">*</span>
            </label>
            <input
              id="endpoint"
              type="text"
              value={formData.endpoint}
              onChange={(e) => handleInputChange('endpoint', e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="예: https://hunel-dev.e-hcg.co.kr:9809/sse"
              className={`form-input ${error && !formData.endpoint.trim() ? 'error' : ''}`}
              disabled={isConnecting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="transport-type" className="form-label">
              전송 타입
            </label>
            <select
              id="transport-type"
              value={formData.transportType}
              onChange={(e) => handleInputChange('transportType', e.target.value)}
              className="form-select"
              disabled={isConnecting}
            >
              <option value="sse">SSE</option>
              <option value="websocket">WebSocket</option>
              <option value="http">HTTP</option>
            </select>
          </div>

          <div className='form-group'>
            <label htmlFor="description" className="form-label">
              설명 (선택사항)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="MCP 서버에 대한 설명을 입력하세요"
              className="form-textarea"
              disabled={isConnecting}
              rows="3"
            />
          </div>

          {/* 에러 메시지 표시 */}
          {error && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              <div className="error-content">
                <span className="error-title">연결 실패</span>
                <p className="error-description">{error}</p>
              </div>
            </div>
          )}

          {/* React Query 에러도 표시 (백업) */}
          {createAgentMutation.isError && !error && (
            <div className="error-message">
              <AlertCircle className="error-icon" />
              <div className="error-content">
                <span className="error-title">연결 실패</span>
                <p className="error-description">
                  {createAgentMutation.error?.message || '알 수 없는 오류가 발생했습니다.'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="connection-actions">
          <button
            className="cancel-button"
            onClick={handleClose}
            disabled={isConnecting}
          >
            취소
          </button>
          <button
            className="connect-button"
            onClick={handleConnect}
            disabled={isConnecting || !isFormValid}
          >
            {isConnecting ? (
              <>
                <div className="loading-spinner"></div>
                <span>연결 중...</span>
              </>
            ) : (
              <>
                <Server className="connect-icon" />
                <span>연결하기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}