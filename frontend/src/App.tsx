import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WorkerSignup } from './pages/worker/WorkerSignup';
import { WorkerLogin } from './pages/worker/WorkerLogin';
import { WorkerVerify } from './pages/worker/WorkerVerify';
import { WorkerVerification } from './pages/worker/WorkerVerification';
import { WorkerCategories } from './pages/worker/WorkerCategories';
import { WorkerLocation } from './pages/worker/WorkerLocation';
import { WorkerDashboard } from './pages/worker/WorkerDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/worker/signup" replace />} />
        <Route path="/worker/signup" element={<WorkerSignup />} />
        <Route path="/worker/login" element={<WorkerLogin />} />
        <Route path="/worker/verify" element={<WorkerVerify />} />
        <Route path="/worker/verification" element={<WorkerVerification />} />
        <Route path="/worker/categories" element={<WorkerCategories />} />
        <Route path="/worker/location" element={<WorkerLocation />} />
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="*" element={<Navigate to="/worker/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
