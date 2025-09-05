import { NavLink, Outlet } from 'react-router-dom';
import css from './AuthPage.module.css';

const AuthPage = () => {
  return (
    <div className={css.contAuth}>
      <div className={css.contNavBurger}>
        <ul className={css.authNavBurger}>
          <li>
            <NavLink
              to="register"
              style={({ isActive }) => ({
                color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
              })}
            >
              <p>Registration</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="login"
              style={({ isActive }) => ({
                color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
              })}
            >
              <p>Log In</p>
            </NavLink>
          </li>
        </ul>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthPage;
