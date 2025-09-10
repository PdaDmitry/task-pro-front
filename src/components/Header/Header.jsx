import { useEffect, useState } from 'react';
import { Dropdown } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import css from './Header.module.css';
import Sidebar from '../Sidebar/Sidebar';
import { updateTheme } from '../../store/auth/authSlice';

const themes = ['Light', 'Dark', 'Violet'];

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.user);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

  const handleMenuClick = e => {
    setSelectedTheme(e.key);
    dispatch(updateTheme(e.key));
  };

  const items = themes.map(theme => ({
    key: theme,
    label: <span style={{ color: selectedTheme === theme ? '#bedbb0' : '#161616' }}>{theme}</span>,
  }));

  return (
    <div className={css.contHeader}>
      {windowWidth < 1440 && (
        <svg className={css.menuSvg} onClick={() => setIsSidebarOpen(true)}>
          <use href="/symbol-defs.svg#icon-menu-01-2"></use>
        </svg>
      )}

      <div className={css.container}>
        <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']}>
          <div className={css.contTheme}>
            Theme
            <svg className={css.themeSvg}>
              <use href="/symbol-defs.svg#icon-chevron-down-2"></use>
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
    </div>
  );
};

export default Header;
