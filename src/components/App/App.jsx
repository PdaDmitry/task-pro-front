import { Route, Routes } from 'react-router-dom';
import WelcomePage from '../../pages/WelcomePage/WelcomePage';

// import css from './App.module.css'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />

        <Route path="*" element={<p>NotFound</p>} />
      </Routes>
    </>
  );
}

export default App;
