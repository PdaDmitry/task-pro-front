import { useState } from 'react';
import { registerUser } from '../../api/auth';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      console.log('✅ Успешная регистрация:', res.data);
    } catch (err) {
      console.error('❌ Ошибка регистрации:', err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h1>Регистрация</h1>
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

export default RegisterForm;
