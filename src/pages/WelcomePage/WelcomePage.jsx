import { NavLink } from 'react-router-dom';
import Vector from '../../../public/Vector-white.svg';
import ImageStart from '../../../public/Image-start-mob-2x.png';

import css from './WelcomePage.module.css';

const WelcomePage = () => {
  return (
    <div className={css.contWelcome}>
      <img src={ImageStart} alt="image_Start" className={css.imageStart} />

      <div className={css.contLogo}>
        <img src={Vector} alt="Vector" className={css.Vector} />
        <h2 className={css.title}>Task Pro</h2>
      </div>

      <p className={css.text}>
        Supercharge your productivity and take control of your tasks with Task Pro - Don't wait,
        start achieving your goals now!
      </p>

      <NavLink to="/auth/register" className={css.btnRegLog}>
        REGISTRATION
      </NavLink>

      <NavLink to="/auth/login" className={css.btnRegLog}>
        LOG IN
      </NavLink>
    </div>
  );
};

export default WelcomePage;
