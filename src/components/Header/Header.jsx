import { useState } from 'react';
import { Dropdown, Button, Menu } from 'antd';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useSelector } from 'react-redux';

import css from './Header.module.css';

const themes = ['Light', 'Dark', 'Violet'];

const Header = () => {
  const currentUser = useSelector(state => state.auth.user);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleMenuClick = e => {
    setSelectedTheme(e.key);
  };

  const items = themes.map(theme => ({
    key: theme,
    label: <span style={{ color: selectedTheme === theme ? '#bedbb0' : '#161616' }}>{theme}</span>,
  }));

  return (
    <div className={css.contHeader}>
      <svg className={css.menuSvg}>
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
          <svg className={css.iconSvg}>
            <use href="/symbol-defs.svg#icon-user"></use>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Header;
