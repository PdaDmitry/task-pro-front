import { useState } from 'react';
import { Dropdown, Button, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { GiHamburgerMenu } from 'react-icons/gi';

const Header = () => {
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleMenuClick = e => {
    setSelectedTheme(e.key);
    console.log('Selected theme:', e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item
        key="Light"
        style={{
          color: selectedTheme === 'Light' ? '#bedbb0' : '#161616',
          backgroundColor: selectedTheme === 'Light' ? 'transparent' : 'transparent',
        }}
      >
        Light
      </Menu.Item>
      <Menu.Item
        key="Dark"
        style={{
          color: selectedTheme === 'Dark' ? '#bedbb0' : '#161616',
          backgroundColor: selectedTheme === 'Dark' ? 'transparent' : 'transparent',
        }}
      >
        Dark
      </Menu.Item>
      <Menu.Item
        key="Violet"
        style={{
          color: selectedTheme === 'Violet' ? '#bedbb0' : '#161616',
          backgroundColor: selectedTheme === 'Violet' ? 'transparent' : 'transparent',
        }}
      >
        Violet
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <GiHamburgerMenu />
      <Dropdown overlay={menu} trigger={['click']}>
        <Button type="text" style={{ padding: '4px 8px', color: '#161616' }}>
          Theme <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default Header;
