import { useState } from 'react';
import CactusMob from '/Cactus/Cactus-mob-2x.png';
import LogoutIcon from '../LogoutIcon/LogoutIcon';

import css from './Sidebar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth/authSlice';
import toast from 'react-hot-toast';
import ModalWindow from '../ModalWindow/ModalWindow';
import CreateBoardModal from '../Modals/CreateBoardModal/CreateBoardModal';
import { icons } from '../../data/icons';

const Sidebar = ({ isSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.auth.user);
  const boardsList = useSelector(state => state.boards.boardsList);
  // console.log('boardsList', boardsList);

  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredLogOut, setIsHoveredLogOut] = useState(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const [activeBoardId, setActiveBoardId] = useState(null);

  const openModal = () => setIsCreateBoardModalOpen(true);
  const closeModal = () => setIsCreateBoardModalOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');

    toast.success('User is logged out!');
  };

  const getIconUrlById = iconId => {
    const foundIcon = icons.find(icon => icon.id === iconId);
    return foundIcon ? foundIcon.url : '#icon-Project';
  };

  return (
    <div
      className={`${css.sidebar} ${
        isSidebarOpen && window.innerWidth < 1440 ? css.sidebarOpen : ''
      }`}
    >
      <div className={css.contBarTitle}>
        <svg className={css.iconSvg}>
          <use
            href={
              currentUser?.theme === 'Violet'
                ? '/symbol-defs.svg#icon-icon'
                : '/symbol-defs.svg#icon-icon-1'
            }
          ></use>
        </svg>
        <h2 className={css.titleBar}>Task Pro</h2>
      </div>
      <p className={css.textMyBoard}>My boards</p>
      <div className={css.contNewBoard}>
        <p className={css.textCreateBoard}>Create a new board</p>

        <svg
          className={css.addBoardSvg}
          onClick={openModal}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {currentUser?.theme === 'Violet' ? (
            <use
              href={
                isHovered
                  ? '/symbol-defs.svg#icon-violet-hover'
                  : '/symbol-defs.svg#icon-violet-normal'
              }
            ></use>
          ) : (
            <use
              href={isHovered ? '/symbol-defs.svg#icon-hover' : '/symbol-defs.svg#icon-normal'}
            ></use>
          )}
        </svg>
      </div>

      {boardsList && boardsList.length > 0 && (
        <ul className={css.boardsList}>
          {boardsList.map(board => (
            <li
              key={board._id}
              className={`${css.boardItem} ${activeBoardId === board._id ? css.activeBoard : ''}`}
              onClick={() => setActiveBoardId(board._id)}
            >
              <div className={css.boardInfo}>
                <svg
                  className={`${css.boardIcon} ${activeBoardId === board._id ? css.activeSVG : ''}`}
                >
                  <use href={`/symbol-defs.svg${getIconUrlById(board.icon)}`} />
                </svg>
                <p className={css.boardTitle}>{board.title}</p>
              </div>

              <div className={css.boardSettings}>
                <div className={css.updateDelBoard}>
                  <svg className={css.updateBoardSvg}>
                    <use href="/symbol-defs.svg#icon-pencil-01"></use>
                  </svg>
                  <svg className={css.deleteBoardSvg}>
                    <use href="/symbol-defs.svg#icon-trash-04-1"></use>
                  </svg>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className={css.contNeedHelp}>
        <img src={CactusMob} alt="image_Cactus" className={css.imageCactusMob} />
        <p className={css.text}>
          If you need help with <span className={css.textSpan}>TaskPro</span>, check out our support
          resources or reach out to our customer support team.
        </p>
        <div className={css.needHelp}>
          <svg className={css.helpSvg}>
            <use href="/symbol-defs.svg#icon-help-circle-1"></use>
          </svg>
          <p className={css.textHelp}>Need help?</p>
        </div>
      </div>
      <div className={css.contLogOut}>
        <button
          type="button"
          onClick={handleLogout}
          className={css.logoutBtn}
          onMouseEnter={() => setIsHoveredLogOut(true)}
          onMouseLeave={() => setIsHoveredLogOut(false)}
        >
          <LogoutIcon
            className={css.logOutSvg}
            size={32}
            color={
              currentUser?.theme === 'Violet'
                ? isHoveredLogOut
                  ? '#B8BCFD'
                  : '#ffffff'
                : isHoveredLogOut
                ? '#9dc888'
                : '#bedbb0'
            }
          />
        </button>

        <p className={css.textLogOut}>Log out</p>
      </div>
      <ModalWindow isOpen={isCreateBoardModalOpen} onClose={closeModal}>
        <CreateBoardModal closeModal={closeModal} />
      </ModalWindow>
    </div>
  );
};

export default Sidebar;
