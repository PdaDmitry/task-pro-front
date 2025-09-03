import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/axiosInstance';
import { setClientAuth } from '../../store/auth/authSlice';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  // const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await request.post('/auth/login', formData);

      localStorage.setItem('token', res.data.token);

      dispatch(
        setClientAuth({
          token: res.data.token,
          user: res.data.user,
        })
      );

      navigate('/homePage');
      toast.success(`Welcome ${res.data.user?.name}!`);
    } catch (err) {
      console.error('❌ Login error:', err.response?.data?.message || err.message);
      // setMessage(err.response?.data?.message || 'Login failed');
      toast.error(err);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Log In Now</button>
      </form>
      {/* {message && <p>{message}</p>} */}
    </div>
  );
};

export default LoginPage;
