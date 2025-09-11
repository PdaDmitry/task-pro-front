import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/axiosInstance';
import { setClientAuth, updateTheme } from '../../store/auth/authSlice';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Loader from '../../components/Loader/Loader';

import css from './LoginPage.module.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^[^\s]{8,64}$/;

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
    if (name === 'email') error = validateEmail(value);
    if (name === 'password') error = validatePassword(value);

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    const newErrors = {
      email: emailError,
      password: passwordError,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err)) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await request.post('/auth/login', formData);

      localStorage.setItem('token', res.data.token);

      dispatch(
        setClientAuth({
          token: res.data.token,
          user: res.data.user,
        })
      );

      dispatch(updateTheme(res.data.user?.theme));

      navigate('/homePage');
      toast.success(`Welcome ${res.data.user?.name}!`);
    } catch (err) {
      console.error('❌ Login error:', err.response?.data?.message || err.message);

      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
            placeholder="Confirm a password"
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
          Log In Now
        </button>
      </form>
      <Loader show={isLoading} />
    </div>
  );
};

export default LoginPage;
