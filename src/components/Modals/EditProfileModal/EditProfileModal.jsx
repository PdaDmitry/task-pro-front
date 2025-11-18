import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import css from './EditProfileModal.module.css';

const EditProfileModal = ({ closeModal }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.user);
  // console.log('currentUser', currentUser);

  const [formData, setFormData] = useState({
    name: currentUser?.name,
    email: currentUser?.email,
    password: '',
  });

  // console.log('formData', formData);

  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [IsHoveredChangePhoto, setIsHoveredChangePhoto] = useState(false);

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
    if (!value.trim()) return '';
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

    console.log('formData', formData);

    // try {
    //   dispatch(setIsLoading(true));

    //   if (isUpdateCard) {
    //     const res = await request.put(`/cards/updateCard/${card._id}`, formData);

    //     if (res.data.status) {
    //       dispatch(updateCardInList(res.data.card));
    //       toast.success(res.data.message);
    //     }
    //   } else {
    //     const res = await request.post('/cards/createCard', formData);

    //     if (res.data.status) {
    //       dispatch(addCard(res.data.card));
    //       toast.success(res.data.message);
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error creating card:', error);
    //   toast.error(error.response.data.message);
    //   return;
    // } finally {
    //   dispatch(setIsLoading(false));
    // }
    // setFormData(initialFormData);
    // setErrors({ title: '', description: '' });

    closeModal();
  };

  return (
    <>
      <div className={css.contEditProfile}>
        <svg className={css.closeBtnSvg} onClick={closeModal}>
          <use href="/symbol-defs.svg#icon-x-close-1"></use>
        </svg>

        <h2 className={css.title}>Edit profile</h2>

        <div className={css.contEditUserPhoto}>
          <svg
            className={css.userSvg}
            onMouseEnter={() => setIsHoveredChangePhoto(true)}
            onMouseLeave={() => setIsHoveredChangePhoto(false)}
          >
            <use href="/symbol-defs.svg#icon-user"></use>
          </svg>
          <svg
            className={css.plusSvg}
            onMouseEnter={() => setIsHoveredChangePhoto(true)}
            onMouseLeave={() => setIsHoveredChangePhoto(false)}
          >
            <use href={`/symbol-defs.svg#icon-plus-${IsHoveredChangePhoto ? '2' : '3'}`}></use>
          </svg>
        </div>

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
              placeholder="Create a new password"
              value={formData.password}
              onChange={handleChange}
              className={css.inputLastElem}
              style={errors.password ? { borderColor: 'red', marginBottom: '2px' } : {}}
            />

            <button
              type="button"
              className={css.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {showPassword ? (
                <FiEyeOff
                  color={
                    currentUser?.theme === 'Violet'
                      ? isHovered
                        ? '#5255bc'
                        : '#7b7ede'
                      : isHovered
                      ? '#9dc888'
                      : '#bedbb0'
                  }
                />
              ) : (
                <FiEye
                  color={
                    currentUser?.theme === 'Violet'
                      ? isHovered
                        ? '#5255bc'
                        : '#7b7ede'
                      : isHovered
                      ? '#9dc888'
                      : '#bedbb0'
                  }
                />
              )}
            </button>
          </div>
          {errors.password && <p className={css.errorPWD}>{errors.password}</p>}

          <button
            type="submit"
            className={
              currentUser?.theme === 'Violet' ? css.editProfileBtnViolet : css.editProfileBtn
            }
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProfileModal;
