import { useState } from 'react';
// import { registerUser } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/axiosInstance';
import { useDispatch } from 'react-redux';
import { setClientAuth } from '../../store/auth/authSlice';
import toast from 'react-hot-toast';

import css from './RegisterPage.module.css';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  // const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await request.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      console.log('✅ Successful registration:', res);
      dispatch(
        setClientAuth({
          user: res.data.user,
          token: res.data.token,
        })
      );
      navigate('/homePage');
      toast.success('Registration was successful!');
    } catch (err) {
      console.error('❌ Registration error:', err.response?.data || err.message);
      toast.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          className={css.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your emai"
          value={formData.email}
          onChange={handleChange}
          className={css.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          className={css.inputLastElem}
        />
        <button type="submit" className={css.btnStyle}>
          Register Now
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
