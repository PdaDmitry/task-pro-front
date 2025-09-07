import { useState } from 'react';
// import { registerUser } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/axiosInstance';
import { useDispatch } from 'react-redux';
import { setClientAuth } from '../../store/auth/authSlice';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import css from './RegisterPage.module.css';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const nameRegex = /^.{2,32}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^[^\s]{8,64}$/;

  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name required';
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = 'The name must be between 2 and 32 characters long.';
    }

    if (!formData.email) {
      newErrors.email = 'Email required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Incorrect email';
    }

    if (!formData.password) {
      newErrors.password = 'Password required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be between 8 and 64 characters long, no spaces.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

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
          style={errors.name ? { borderColor: 'red', marginBottom: '2px' } : {}}
        />
        {errors.name && <p className={css.error}>{errors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Enter your emai"
          value={formData.email}
          onChange={handleChange}
          className={css.input}
          style={errors.email ? { borderColor: 'red', marginBottom: '2px' } : {}}
        />
        {errors.email && <p className={css.error}>{errors.email}</p>}

        <div className={css.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            // type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            className={css.inputLastElem}
            style={errors.password ? { borderColor: 'red', marginBottom: '2px' } : {}}
          />

          <button
            type="button"
            className={css.eyeBtn}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.password && <p className={css.errorPWD}>{errors.password}</p>}

        <button type="submit" className={css.btnStyle}>
          Register Now
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
