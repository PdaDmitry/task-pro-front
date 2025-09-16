import { useState } from 'react';
import { backgrounds } from '../../../data/backgroundIcons';
import { getBackgroundUrl } from '../../../utils/getBackgroundUrl';
import { icons } from '../../../data/icons';

import css from './CreateBoardModal.module.css';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import request from '../../../utils/axiosInstance';
import Loader from '../../Loader/Loader';
import { addBoard } from '../../../store/boards/boards,js';

const CreateBoardModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const [formData, setFormData] = useState({
    title: '',
    icon: 'icon0',
    background: 'bgIcon0',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const theme = currentUser?.theme || 'Light';

  const handleChange = e => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Board name is required');
      return;
    }

    // console.log(formData);

    try {
      setIsLoading(true);
      const res = await request.post('/boards/createBoard', formData);

      // console.log(res.data);
      dispatch(addBoard(res.data.board));
      toast.success(res.data.message);
    } catch (error) {
      console.error('Error creating board:', error);
      toast.error('Failed to create board. Please try again.');
      return;
    } finally {
      setIsLoading(false);
    }

    setFormData({ title: '', icon: '', background: '' });
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
          {icons.map(icon => (
            <svg
              key={icon.id}
              className={`${css.iconItem} ${formData.icon === icon.id ? css.active : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, icon: icon.id }))}
            >
              <use href={`/symbol-defs.svg${icon.url}`} />
            </svg>
          ))}
        </div>

        {/* Selecting a background */}
        <p className={css.titleBgr}>Background</p>

        <div className={css.contBgr}>
          {backgrounds.map(bg => {
            const bgUrl = getBackgroundUrl(bg, theme);

            return bgUrl.startsWith('#') ? (
              <svg
                key={bg.id}
                className={`${css.bgItem} ${formData.background === bg.id ? css.active : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, background: bg.id }))}
              >
                <use href={`/symbol-defs.svg${bgUrl}`} />
              </svg>
            ) : (
              <img
                key={bg.id}
                src={bgUrl}
                alt="background"
                className={`${css.bgItem} ${formData.background === bg.id ? css.active : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, background: bg.id }))}
              />
            );
          })}
        </div>

        <button
          type="submit"
          className={
            currentUser?.theme === 'Violet' ? css.createBoardtBtnViolet : css.createBoardtBtn
          }
        >
          <svg className={css.createBtnSvg}>
            <use
              href={
                currentUser?.theme === 'Violet'
                  ? '/symbol-defs.svg#icon-plus-4'
                  : '/symbol-defs.svg#icon-plus-1'
              }
            ></use>
          </svg>
          Create
        </button>
      </form>
      <Loader show={isLoading} />
    </div>
  );
};

export default CreateBoardModal;
