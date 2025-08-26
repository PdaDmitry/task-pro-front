import { NavLink, Outlet } from 'react-router-dom';
import css from './AuthPage.module.css';

const AuthPage = () => {
  return (
    <div>
      <ul className={css.authNavBurger}>
        <li className={css.liItemLog}>
          <NavLink to="login">
            <div className={css.burgerLiNavlog}>
              <p className={css.linkAuth}>LOG IN</p>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="register">
            <div className={css.burgerLiNav}>
              <p className={css.linkAuth}>REGISTRATION</p>
            </div>
          </NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export default AuthPage;
