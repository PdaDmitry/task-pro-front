import { useDispatch, useSelector } from 'react-redux';
import ActiveBoard from '../../components/ActiveBoard/ActiveBoard';

import css from './HomePage.module.css';
import { getBackgroundImage } from '../../utils/getBackgroundImage';

const HomePage = () => {
  const activeBoard = useSelector(state => state.boards.activeBoard);
  const width = window.innerWidth;

  // console.log('activeBoard in HomePage', activeBoard);

  const bgUrl = getBackgroundImage(activeBoard?.background, width);

  return (
    <div
      className={css.contHomePage}
      style={
        activeBoard?._id
          ? {
              backgroundImage: `url(${bgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {}
      }
    >
      {activeBoard?._id ? (
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
