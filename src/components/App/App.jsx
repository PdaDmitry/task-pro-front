import { Route, Routes } from 'react-router-dom';
import WelcomePage from '../../pages/WelcomePage/WelcomePage';
import AuthPage from '../../pages/AuthPage/AuthPage';
import LoginForm from '../../pages/LoginForm/LoginForm';
import RegisterForm from '../../pages/RegisterForm/RegisterForm';
import HomePage from '../../pages/HomePage/HomePage';

// import css from './App.module.css'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth" element={<AuthPage />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
        </Route>
        <Route path="/homePage" element={<HomePage />} />
        <Route path="*" element={<p>NotFound</p>} />
      </Routes>
    </>
  );
}

export default App;
