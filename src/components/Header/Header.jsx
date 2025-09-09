import { useEffect, useState } from 'react';
import { Dropdown, Button, Menu } from 'antd';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useSelector } from 'react-redux';
import CactusMob from '/Cactus/Cactus-mob-2x.png';

import css from './Header.module.css';
import LogoutIcon from '../LogoutIcon/LogoutIcon';

const themes = ['Light', 'Dark', 'Violet'];

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const currentUser = useSelector(state => state.auth.user);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

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
  };

  const items = themes.map(theme => ({
    key: theme,
    label: <span style={{ color: selectedTheme === theme ? '#bedbb0' : '#161616' }}>{theme}</span>,
  }));

  return (
    <div className={css.contHeader}>
      <svg className={css.menuSvg} onClick={() => setIsSidebarOpen(true)}>
        <use href="/symbol-defs.svg#icon-menu-01-2"></use>
      </svg>

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
      <div
        className={css.sidebar}
        style={{
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <div className={css.contBarTitle}>
          <svg className={css.iconSvg}>
            <use href="/symbol-defs.svg#icon-icon-1"></use>
          </svg>
          <h2 className={css.titleBar}>Task Pro</h2>
        </div>
        <p className={css.textMyBoard}>My boards</p>

        <div className={css.contNewBoard}>
          <p className={css.textCreateBoard}>Create a new board</p>
          <svg
            className={css.addBoardSvg}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <use
              href={isHovered ? '/symbol-defs.svg#icon-normal' : '/symbol-defs.svg#icon-hover'}
            ></use>
          </svg>
        </div>

        <div className={css.contNeedHelp}>
          <img src={CactusMob} alt="image_Cactus" className={css.imageCactusMob} />
          <p className={css.text}>
            If you need help with <span className={css.textSpan}>TaskPro</span>, check out our
            support resources or reach out to our customer support team.
          </p>
          <div className={css.needHelp}>
            <svg className={css.helpSvg}>
              <use href="/symbol-defs.svg#icon-help-circle-1"></use>
            </svg>

            <p className={css.textHelp}>Need help?</p>
          </div>
        </div>

        <div className={css.contLogOut}>
          <LogoutIcon className={css.logOutSvg} size={32} color="#bedbb0" />
          <p className={css.textLogOut}>Log out </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
