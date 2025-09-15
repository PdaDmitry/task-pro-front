import { useDispatch, useSelector } from 'react-redux';

import css from './HomePage.module.css';

const HomePage = () => {
  const currentUser = useSelector(state => state.auth.user);
  // console.log('currentUser', currentUser);

  return (
    <div className={css.contHomePage}>
      <div className={css.homePageContent}>
        <p className={css.textHomePage}>
          Before starting your project, it is essential{' '}
          <span className={css.textHomeSpan}>to create a board</span> to visualize and track all the
          necessary tasks and milestones. This board serves as a powerful tool to organize the
          workflow and ensure effective collaboration among team members.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
