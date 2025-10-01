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
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            border: `4px solid rgba(190, 219, 176, 0.3)`,
            borderTop: `4px solid #bedbb0`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p
          style={{
            marginTop: 16,
            color: '#ffffff',
            fontSize: '22px',
            fontWeight: '500',
          }}
        >
          Please wait...
        </p>
      </div>
    </div>
  );
};

export default Loader;
