import { useState } from 'react';
import { registerUser } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
      console.log('✅ Successful registration:', res.data);
      navigate('/homePage');
    } catch (err) {
      console.error('❌ Registration error:', err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your emai"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Register Now</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterPage;
