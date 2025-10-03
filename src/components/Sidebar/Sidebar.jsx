import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth/authSlice';
import { icons } from '../../data/icons';
import { removeBoard, returnInitialState, setActiveBoard } from '../../store/boards/boards';
import { Popconfirm } from 'antd';
import { setIsLoading } from '../../store/loader/loaderSlice';

import CactusMob from '/Cactus/Cactus-mob-2x.png';
import LogoutIcon from '../LogoutIcon/LogoutIcon';
import toast from 'react-hot-toast';
import ModalWindow from '../ModalWindow/ModalWindow';
import CreateBoardModal from '../Modals/CreateBoardModal/CreateBoardModal';
import request from '../../utils/axiosInstance';
import UpdateBoardModal from '../Modals/UpdateBoardModal/UpdateBoardModal';

import css from './Sidebar.module.css';
import { setColumnsList } from '../../store/columns/columnsSlise';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.auth.user);
  const boardsList = useSelector(state => state.boards.boardsList);
  const activeBoard = useSelector(state => state.boards.activeBoard);

  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredLogOut, setIsHoveredLogOut] = useState(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const [isUpdateBoardModalOpen, setIsUpdateBoardModalOpen] = useState(false);

  const openModal = () => setIsCreateBoardModalOpen(true);
  const closeModal = () => setIsCreateBoardModalOpen(false);

  const openUpdateBoardModal = () => setIsUpdateBoardModalOpen(true);
  const closeUpdateBoardModal = () => setIsUpdateBoardModalOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(returnInitialState());
    navigate('/auth/login');

    toast.success('User is logged out!');
  };

  const getIconUrlById = iconId => {
    const foundIcon = icons.find(icon => icon.id === iconId);
    return foundIcon ? foundIcon.url : '#icon-Project';
  };

  const handleDeleteBoard = async boardId => {
    try {
      dispatch(setIsLoading(true));
      const res = await request.delete('/boards/deleteBoard', { data: { boardId } });
      if (res.data.status) {
        dispatch(removeBoard(boardId));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.error('Error deleting board:', error);
      toast.error('Failed to delete board. Please try again.');
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const openBoard = async board => {
    try {
      dispatch(setIsLoading(true));
      dispatch(setActiveBoard(board));
      const resColumns = await request.get('/columns/getBoardColumns', {
        params: { boardId: board._id },
      });

      dispatch(setColumnsList(resColumns.data.columns));
    } catch (err) {
      console.error('❌ Error loading data:', err.response?.data?.message || err.message);
    } finally {
      dispatch(setIsLoading(false));
    }

    window.innerWidth < 1440 && setIsSidebarOpen(false);
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
              className={`${css.boardItem} ${
                activeBoard?._id === board._id ? css.activeBoard : ''
              }`}
            >
              <div className={css.boardInfo} onClick={() => openBoard(board)}>
                <svg
                  className={`${css.boardIcon} ${
                    activeBoard?._id === board._id ? css.activeSVG : ''
                  }`}
                >
                  <use href={`/symbol-defs.svg${getIconUrlById(board.icon)}`} />
                </svg>
                <p className={css.boardTitle}>{board.title}</p>
              </div>

              <div className={css.boardSettings}>
                <div className={css.updateDelBoard}>
                  <svg className={css.updateBoardSvg} onClick={openUpdateBoardModal}>
                    <use href="/symbol-defs.svg#icon-pencil-01"></use>
                  </svg>
                  <Popconfirm
                    title="Are you sure you want to delete this board?"
                    onConfirm={() => handleDeleteBoard(board._id)}
                    okText="Confirm"
                    cancelText="Cancel"
                  >
                    <svg className={css.deleteBoardSvg}>
                      <use href="/symbol-defs.svg#icon-trash-04-1"></use>
                    </svg>
                  </Popconfirm>
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

      <ModalWindow isOpen={isUpdateBoardModalOpen} onClose={closeUpdateBoardModal}>
        <UpdateBoardModal closeModal={closeUpdateBoardModal} />
      </ModalWindow>
    </div>
  );
};

export default Sidebar;
