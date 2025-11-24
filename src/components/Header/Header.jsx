import { useEffect, useState } from 'react';
import { Dropdown } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateTheme } from '../../store/auth/authSlice';
import { setIsLoading } from '../../store/loader/loaderSlice';
import { THEMES } from '../../utils/constants';

import Sidebar from '../Sidebar/Sidebar';
import request from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import ModalWindow from '../ModalWindow/ModalWindow';
import EditProfileModal from '../Modals/EditProfileModal/EditProfileModal';

import css from './Header.module.css';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.user);

  const [selectedTheme, setSelectedTheme] = useState(currentUser?.theme);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpenEditProfile, setIsOpenEditProfile] = useState(false);

  const openModalEditProfile = () => setIsOpenEditProfile(true);
  const closeModalEditProfile = () => setIsOpenEditProfile(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      if (window.innerWidth >= 1440 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  useEffect(() => {
    if (windowWidth >= 1440 && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [windowWidth, isSidebarOpen, setIsSidebarOpen]);

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setIsSidebarOpen]);

  const handleMenuClick = async e => {
    setSelectedTheme(e.key);
    setIsDropdownOpen(false);

    if (currentUser?.theme === e.key) return;

    try {
      dispatch(setIsLoading(true));
      const res = await request.patch('/auth/updateTheme', { theme: e.key });

      dispatch(updateTheme(res.data.user?.theme));
      toast.success(`Theme updated to ${res.data.user?.theme}`);
    } catch (err) {
      console.error('❌ Update theme error:', err.response?.data?.message || err.message);

      toast.error(err);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const items = THEMES.map(theme => ({
    key: theme,
    label: theme,
  }));

  const host = import.meta.env.VITE_API_URL;
  const photoUrl = currentUser?.photo
    ? currentUser.photo.startsWith('http')
      ? currentUser.photo
      : `${host}${currentUser.photo}`
    : null;

  return (
    <div className={css.contHeader}>
      {windowWidth < 1440 &&
        (currentUser?.theme === 'Dark' ? (
          <svg className={css.menuSvg} onClick={() => setIsSidebarOpen(true)}>
            <use href="/symbol-defs.svg#icon-menu-01-3" />
          </svg>
        ) : (
          <svg
            className={css.menuSvg}
            onClick={() => setIsSidebarOpen(true)}
            color={currentUser?.theme === 'Violet' ? '#161616' : ''}
          >
            <use href="/symbol-defs.svg#icon-menu-01-2" />
          </svg>
        ))}

      <div className={css.container}>
        <Dropdown
          trigger={['click']}
          open={isDropdownOpen}
          onOpenChange={setIsDropdownOpen}
          popupRender={() => (
            <div
              className={css.dropdownWrapper}
              style={{
                border: currentUser?.theme === 'Dark' ? '1px solid #9dc888' : '',
              }}
            >
              {items.map(item => (
                <div
                  key={item.key}
                  className={`${css.dropdownItem} ${
                    selectedTheme === item.key
                      ? item.key === 'Violet'
                        ? css.selectedViolet
                        : css.selectedLight
                      : ''
                  }`}
                  onClick={() => handleMenuClick({ key: item.key })}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        >
          <div className={css.contTheme}>
            Theme
            <svg className={css.themeSvg}>
              <use
                href={
                  currentUser?.theme === 'Dark'
                    ? '/symbol-defs.svg#icon-chevron-down-5'
                    : '/symbol-defs.svg#icon-chevron-down-2'
                }
              ></use>
            </svg>
          </div>
        </Dropdown>

        <div className={css.contUser}>
          <p className={css.name}>{currentUser?.name}</p>
          {currentUser?.photo ? (
            <img
              src={photoUrl}
              alt="user photo"
              className={css.userPhoto}
              onClick={openModalEditProfile}
            />
          ) : (
            <svg className={css.userSvg} onClick={openModalEditProfile}>
              <use href="/symbol-defs.svg#icon-user"></use>
            </svg>
          )}
        </div>
      </div>

      {/* sidebar */}
      {windowWidth < 1440 && (
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      )}

      <ModalWindow isOpen={isOpenEditProfile} onClose={closeModalEditProfile}>
        <EditProfileModal closeModal={closeModalEditProfile} />
      </ModalWindow>
    </div>
  );
};

export default Header;
