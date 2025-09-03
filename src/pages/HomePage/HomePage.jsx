import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth/authSlice';
import toast from 'react-hot-toast';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');

    toast.success('User is logged out!');
  };

  return (
    <>
      <div>HomePage</div>
      <p>Hello {currentUser?.name}</p>
      <button onClick={handleLogout}>Log Out</button>
    </>
  );
};

export default HomePage;
