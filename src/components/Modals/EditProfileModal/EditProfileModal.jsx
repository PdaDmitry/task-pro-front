import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import css from './EditProfileModal.module.css';
import toast from 'react-hot-toast';
import { setIsLoading } from '../../../store/loader/loaderSlice';
import request from '../../../utils/axiosInstance';
import { updateUserProfile } from '../../../store/auth/authSlice';

const EditProfileModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const currentUser = useSelector(state => state.auth.user);

  // console.log('currentUser', currentUser);

  const [formData, setFormData] = useState({
    name: currentUser?.name,
    email: currentUser?.email,
    password: '',
  });

  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [IsHoveredChangePhoto, setIsHoveredChangePhoto] = useState(false);

  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentUser?.photo || null);

  useEffect(() => {
    if (!selectedPhotoFile) {
      setPreviewUrl(currentUser?.photo || null);
    }
  }, [currentUser?.photo, selectedPhotoFile]);

  // // eslint-disable-next-line react-hooks/exhaustive-deps

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

  // =================================================================================

  const onClickPhotoBlock = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = e => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeMb = 5;
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`File too large. Max ${maxSizeMb} MB.`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Only images allowed');
      return;
    }

    setSelectedPhotoFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeSelectedPhoto = async () => {
    if (selectedPhotoFile) {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedPhotoFile(null);

      setPreviewUrl(currentUser?.photo || null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      dispatch(setIsLoading(true));

      const res = await request.patch('/auth/removeUserPhoto');

      console.log(res);

      if (res.data?.status) {
        dispatch(updateUserProfile(res.data.user));

        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        toast.success('Photo removed');
      } else {
        toast.error(res.data?.message || 'Failed to remove photo');
      }
    } catch (err) {
      console.error('Remove photo error:', err);
      toast.error(err?.response?.data?.message || 'Error removing photo');
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  // ===============================================================================

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

    const isNameChanged = formData.name.trim() !== (currentUser?.name || '').trim();
    const isEmailChanged =
      formData.email.trim().toLowerCase() !== (currentUser?.email || '').trim();
    const isPasswordChanged = formData.password.trim() !== '';
    const isPhotoChanged = !!selectedPhotoFile;

    const nothingChanged =
      !isNameChanged && !isEmailChanged && !isPasswordChanged && !isPhotoChanged;

    if (nothingChanged) {
      toast('You have not made any changes!', {
        icon: '⚠️',
      });

      closeModal();
      return;
    }

    try {
      dispatch(setIsLoading(true));

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      if (formData.password) payload.append('password', formData.password);
      if (selectedPhotoFile) payload.append('photo', selectedPhotoFile);

      const res = await request.patch('/auth/updateUserProfile', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status) {
        dispatch(updateUserProfile(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error(error.response.data.message);
      return;
    } finally {
      dispatch(setIsLoading(false));
    }

    setErrors({ name: '', email: '', password: '' });
    closeModal();
  };

  const attachPhotoHandlers = {
    onMouseEnter: () => setIsHoveredChangePhoto(true),
    onMouseLeave: () => setIsHoveredChangePhoto(false),
    onClick: onClickPhotoBlock,
    onKeyDown: e => {
      if (e.key === 'Enter') onClickPhotoBlock();
    },
  };

  const host = import.meta.env.VITE_API_URL;
  const finalPhotoUrl = selectedPhotoFile
    ? previewUrl
    : currentUser?.photo
    ? currentUser.photo.startsWith('http')
      ? currentUser.photo
      : `${host}${currentUser.photo}`
    : null;

  return (
    <>
      <div className={css.contEditProfile}>
        <svg className={css.closeBtnSvg} onClick={closeModal}>
          <use href="/symbol-defs.svg#icon-x-close-1"></use>
        </svg>

        <h2 className={css.title}>Edit profile</h2>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        <div className={css.contEditUserPhoto}>
          {finalPhotoUrl ? (
            <img src={finalPhotoUrl} alt="preview" className={css.photoPreview} />
          ) : (
            <svg className={css.userSvg} {...attachPhotoHandlers} tabIndex={0} role="button">
              <use href="/symbol-defs.svg#icon-user"></use>
            </svg>
          )}

          <svg className={css.plusSvg} {...attachPhotoHandlers} tabIndex={0} role="button">
            {currentUser?.theme === 'Violet' ? (
              <use href={`/symbol-defs.svg#icon-plus-${IsHoveredChangePhoto ? '2' : '3'}`} />
            ) : (
              <use href={`/symbol-defs.svg#icon-plus${IsHoveredChangePhoto ? '' : '-4'}`} />
            )}
          </svg>
        </div>

        {finalPhotoUrl && (
          <div className={css.previewControls}>
            <button type="button" className={css.removePhotoBtn} onClick={removeSelectedPhoto}>
              Remove
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={css.input}
            style={errors.name ? { borderColor: 'red', marginBottom: '2px' } : {}}
          />
          {errors.name && <p className={css.error}>{errors.name}</p>}

          <input
            type="email"
            name="email"
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
