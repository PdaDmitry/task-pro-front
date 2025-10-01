import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setClientAuth } from '../../store/auth/authSlice';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { setIsLoading } from '../../store/loader/loaderSlice';

import request from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

import css from './RegisterPage.module.css';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const nameRegex = /^.{2,32}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^[^\s]{8,64}$/;

  const validateName = value => {
    if (!value.trim()) return 'Name required';
    if (!nameRegex.test(value)) return 'The name must be between 2 and 32 characters long!';
    return '';
  };

  const validateEmail = value => {
    if (!value.trim()) return 'Email required';
    if (!emailRegex.test(value)) return 'Incorrect email!';
    return '';
  };

  const validatePassword = value => {
    if (!value.trim()) return 'Password required';
    if (!passwordRegex.test(value))
      return 'Password must be between 8 and 64 characters long, no spaces!';
    return '';
  };

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    let error = '';
    if (name === 'name') error = validateName(value);
    if (name === 'email') error = validateEmail(value);
    if (name === 'password') error = validatePassword(value);

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    const newErrors = {
      name: nameError,
      email: emailError,
      password: passwordError,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err)) {
      return;
    }

    try {
      dispatch(setIsLoading(true));
      const res = await request.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);

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
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      dispatch(setIsLoading(false));
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
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className={css.input}
          style={errors.email ? { borderColor: 'red', marginBottom: '2px' } : {}}
        />
        {errors.email && <p className={css.error}>{errors.email}</p>}

        <div className={css.passwordWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
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

        <button type="submit" className={css.btnStyle} disabled={isLoading}>
          Register Now
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
