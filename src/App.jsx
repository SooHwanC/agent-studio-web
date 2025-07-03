import { Routes, Route, Navigate } from 'react-router-dom';
import MCPAgentPage from './pages/MCPAgentPage';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/reset.scss';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <Routes>
          <Route path="/" element={<MCPAgentPage />} />
          <Route path="/settings" element={<div>설정 페이지 (준비중)</div>} />
          <Route path="/logs" element={<div>로그 페이지 (준비중)</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;