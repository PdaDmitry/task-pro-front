import { useDispatch, useSelector } from 'react-redux';

import css from './HomePage.module.css';

const HomePage = () => {
  const currentUser = useSelector(state => state.auth.user);
  // console.log('currentUser', currentUser);

  return <div className={css.contHomePage}>HomePage</div>;
};

export default HomePage;
