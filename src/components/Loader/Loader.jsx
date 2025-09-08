import { Spin } from 'antd';

const Loader = ({ show }) => {
  if (!show) return null;

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        left: 0,
        zIndex: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Spin size="large" />
        <p style={{ marginTop: 10, color: 'rgba(37, 2, 113, 1)' }}>Please wait...</p>
      </div>
    </div>
  );
};

export default Loader;
