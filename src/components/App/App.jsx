import { Route, Routes, useLocation } from 'react-router-dom';
import WelcomePage from '../../pages/WelcomePage/WelcomePage';
import AuthPage from '../../pages/AuthPage/AuthPage';
import HomePage from '../../pages/HomePage/HomePage';
import RegisterPage from '../../pages/RegisterPage/RegisterPage';
import LoginPage from '../../pages/LoginPage/LoginPage';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import Header from '../Header/Header';
import { useState } from 'react';

import css from './App.module.css';

function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isWelcomePage = location.pathname === '/';
  const isRegisterPage = location.pathname === '/auth/register';
  const isLoginPage = location.pathname === '/auth/login';

  return (
    <>
      <div className={`${css.backdrop} ${isSidebarOpen ? css.backdropVisible : ''}`}></div>
      {/* {isSidebarOpen && <div className={css.backdrop}></div>} */}
      <div>
        {!isWelcomePage && !isRegisterPage && !isLoginPage && (
          <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        )}
        <Toaster />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/auth" element={<AuthPage />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          <Route
            path="/homePage"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<p>NotFound</p>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
