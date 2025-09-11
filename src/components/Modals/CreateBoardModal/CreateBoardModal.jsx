import { useState } from 'react';
import css from './CreateBoardModal.module.css';

const backgrounds = ['/bg1.png', '/bg2.png', '/bg3.png'];
const icons = ['/icon1.svg', '/icon2.svg', '/icon3.svg'];

const CreateBoardModal = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    title: '',
    icon: '',
    background: '',
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Board name is required');
      return;
    }

    console.log(formData);

    setFormData({
      title: '',
      icon: '',
      background: '',
    });
    setError('');

    closeModal();
  };

  return (
    <div className={css.contNewBoard}>
      <svg className={css.closeBtnSvg} onClick={closeModal}>
        <use href="/symbol-defs.svg#icon-x-close-1"></use>
      </svg>
      <h2 className={css.title}>New board</h2>

      <form onSubmit={handleSubmit}>
        {/* Board name */}
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className={css.input}
          style={error ? { borderColor: 'red', marginBottom: '2px' } : {}}
        />
        {error && <p className={css.error}>{error}</p>}

        {/* Icon selection */}
        <p className={css.titleIcons}>Icons</p>
        <div className={css.contIcons}>
          {backgrounds.map(bg => (
            <img
              key={bg}
              src={bg}
              alt="background"
              className={`${css.iconItem} ${formData.background === bg ? css.active : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, background: bg }))}
            />
          ))}
        </div>

        {/* Selecting a background */}
        <p className={css.titleBgr}>Background</p>
        <div className={css.contBgr}>
          {icons.map(icon => (
            <img
              key={icon}
              src={icon}
              alt="icon"
              className={`${css.bgItem} ${formData.icon === icon ? css.active : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, icon }))}
            />
          ))}
        </div>

        {/* Кнопка создания */}
        <button type="submit" className={css.createBoardtBtn}>
          <svg className={css.createBtnSvg} onClick={closeModal}>
            <use href="/symbol-defs.svg#icon-plus-1"></use>
          </svg>
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateBoardModal;
