import { v4 as uuidv4 } from 'uuid';

export const createMCPSlice = (set, get) => ({
 // MCP 연결 상태
 mcp: {
   sessionId: null,
   serverName: '',
   endpoint: '',
   transportType: 'sse',
   isConnected: false,
   connectedAt: null,
   error: null,
 },

 // 세션 ID 생성 및 로컬스토리지 저장
 generateSessionId: () => {
   const sessionId = uuidv4();
   localStorage.setItem('mcp_session_id', sessionId);
   
   set((state) => ({
     mcp: {
       ...state.mcp,
       sessionId,
     }
   }));
   
   return sessionId;
 },

 // 로컬스토리지에서 세션 ID 불러오기
 loadSessionId: () => {
   const sessionId = localStorage.getItem('mcp_session_id');
   if (sessionId) {
     set((state) => ({
       mcp: {
         ...state.mcp,
         sessionId,
       }
     }));
   }
   return sessionId;
 },

 // MCP 연결 정보 설정
 setConnectionInfo: (connectionData) => {
   const connectionInfo = {
     sessionId: connectionData.sessionId,
     serverName: connectionData.serverName,
     endpoint: connectionData.endpoint,
     transportType: connectionData.transportType,
     isConnected: connectionData.isConnected,
     connectedAt: connectionData.connectedAt,
     error: null,
   };

   // 로컬스토리지에 연결 정보 저장
   localStorage.setItem('mcp_connection', JSON.stringify(connectionInfo));

   set((state) => ({
     mcp: {
       ...state.mcp,
       ...connectionInfo,
     }
   }));
 },

 // 로컬스토리지에서 연결 정보 불러오기
 loadConnectionInfo: () => {
   try {
     const connectionData = localStorage.getItem('mcp_connection');
     if (connectionData) {
       const parsedData = JSON.parse(connectionData);
       set((state) => ({
         mcp: {
           ...state.mcp,
           ...parsedData,
         }
       }));
       return parsedData;
     }
   } catch (error) {
     console.error('Failed to load connection info:', error);
   }
   return null;
 },

 // MCP 연결 해제
 disconnectMCP: () => {
   localStorage.removeItem('mcp_connection');
   localStorage.removeItem('mcp_session_id');
   
   set((state) => ({
     mcp: {
       sessionId: null,
       serverName: '',
       endpoint: '',
       transportType: 'sse',
       isConnected: false,
       connectedAt: null,
       error: null,
     }
   }));
 },

 // MCP 에러 설정
 setMCPError: (error) => {
   set((state) => ({
     mcp: {
       ...state.mcp,
       error,
       isConnected: false,
     }
   }));
 },

 // MCP 상태 초기화 (앱 시작시)
 initializeMCP: () => {
   const { loadSessionId, loadConnectionInfo } = get();
   loadSessionId();
   loadConnectionInfo();
 },
});