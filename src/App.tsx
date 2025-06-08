import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import store, { RootState } from './store/store';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';

const AppContent: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const navigate = useNavigate();

  // Redirect to login if not authenticated, unless already on login page
  React.useEffect(() => {
    if (!isAuthenticated && window.location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="h-screen w-full bg-white dark:bg-gray-900">
      <Sidebar />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AppContent />} /> {/* Catch-all for authenticated routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
