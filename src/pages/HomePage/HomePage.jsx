import { useDispatch, useSelector } from 'react-redux';

import css from './HomePage.module.css';
import ActiveBoard from '../../components/ActiveBoard/ActiveBoard';

const HomePage = () => {
  // const currentUser = useSelector(state => state.auth.user);
  const activeBoard = useSelector(state => state.boards.activeBoard);
  // console.log('activeBoardId', activeBoard?.activeBoardId);

  return (
    <div className={css.contHomePage}>
      {activeBoard?.activeBoardId ? (
        <ActiveBoard />
      ) : (
        <div className={css.homePageContent}>
          <p className={css.textHomePage}>
            Before starting your project, it is essential{' '}
            <span className={css.textHomeSpan}>to create a board</span> to visualize and track all
            the necessary tasks and milestones. This board serves as a powerful tool to organize the
            workflow and ensure effective collaboration among team members.
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
