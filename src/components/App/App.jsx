import { Route, Routes } from 'react-router-dom';
import WelcomePage from '../../pages/WelcomePage/WelcomePage';
import AuthPage from '../../pages/AuthPage/AuthPage';
import HomePage from '../../pages/HomePage/HomePage';
import RegisterPage from '../../pages/RegisterPage/RegisterPage';
import LoginPage from '../../pages/LoginPage/LoginPage';

// import css from './App.module.css'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth" element={<AuthPage />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="/homePage" element={<HomePage />} />
        <Route path="*" element={<p>NotFound</p>} />
      </Routes>
    </>
  );
}

export default App;
