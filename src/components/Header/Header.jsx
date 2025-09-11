import { useEffect, useState } from 'react';
import { Dropdown } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import css from './Header.module.css';
import Sidebar from '../Sidebar/Sidebar';
import { updateTheme } from '../../store/auth/authSlice';
import request from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import Loader from '../Loader/Loader';

const themes = ['Light', 'Dark', 'Violet'];

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.user);
  console.log('currentUser theme', currentUser?.theme === 'Dark');

  const [selectedTheme, setSelectedTheme] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(false);

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

    try {
      setIsLoading(true);
      const res = await request.patch('/users/updateTheme', { theme: e.key });

      dispatch(updateTheme(res.data.user?.theme));
      toast.success(`Theme updated to ${res.data.user?.theme}`);
    } catch (err) {
      console.error('❌ Update theme error:', err.response?.data?.message || err.message);

      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const items = themes.map(theme => ({
    key: theme,
    label: <span style={{ color: selectedTheme === theme ? '#bedbb0' : '#161616' }}>{theme}</span>,
  }));

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
        <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']}>
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
          <svg className={css.userSvg}>
            <use href="/symbol-defs.svg#icon-user"></use>
          </svg>
        </div>
      </div>

      {/* sidebar */}
      {windowWidth < 1440 && <Sidebar isSidebarOpen={isSidebarOpen} />}
      <Loader show={isLoading} />
    </div>
  );
};

export default Header;
