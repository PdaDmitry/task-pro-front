import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../store/auth/authSlice';
import { returnInitialState } from '../../../store/boards/boards';

import toast from 'react-hot-toast';
import css from './LogOutModal.module.css';

const LogOutModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(returnInitialState());
    navigate('/auth/login');

    toast.success('User is logged out!');
  };

  return (
    <div
      className={css.contLogOut}
      style={{
        border: currentUser?.theme === 'Dark' ? ' 1px solid  #9dc888' : '',
      }}
    >
      <svg className={css.closeBtnSvg} onClick={closeModal}>
        <use href="/symbol-defs.svg#icon-x-close-1"></use>
      </svg>
      <h2 className={css.title}>Are you sure you want to log out?</h2>
      <div className={css.buttonsContainer}>
        <button
          className={currentUser?.theme === 'Violet' ? css.logoutBtnViolet : css.logoutBtn}
          onClick={handleLogout}
        >
          Log Out
        </button>
        <button
          className={currentUser?.theme === 'Violet' ? css.logoutBtnViolet : css.logoutBtn}
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LogOutModal;
