import { NavLink } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>WelcomePage</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <NavLink to="/auth/register">
          <button>REGISTRATION</button>
        </NavLink>

        <NavLink to="/auth/login">
          <button>LOG IN</button>
        </NavLink>
      </div>
    </div>
  );
};

export default WelcomePage;
