import { useState } from 'react';
import { backgrounds } from '../../../data/backgroundIcons';
import { getBackgroundUrl } from '../../../utils/getBackgroundUrl';
import { icons } from '../../../data/icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateBoardInList } from '../../../store/boards/boards';
import { setIsLoading } from '../../../store/loader/loaderSlice';

import toast from 'react-hot-toast';
import request from '../../../utils/axiosInstance';

import css from './UpdateBoardModal.module.css';

const UpdateBoardModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const activeBoard = useSelector(state => state.boards.activeBoard);

  const [formData, setFormData] = useState({
    title: activeBoard?.title || '',
    icon: activeBoard?.icon || 'icon0',
    background: activeBoard?.background || 'bgIcon0',
  });
  const [error, setError] = useState('');

  const theme = currentUser?.theme || 'Light';
  const MAX_TITLE_LENGTH = 12;

  const truncateTitle = title => {
    if (title.length <= MAX_TITLE_LENGTH) return title;
    return title.substring(0, MAX_TITLE_LENGTH) + '...';
  };

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

    try {
      dispatch(setIsLoading(true));

      const truncatedData = {
        ...formData,
        title: truncateTitle(formData.title),
      };

      const res = await request.put(`/boards/updateBoard/${activeBoard._id}`, truncatedData);

      dispatch(updateBoardInList(res.data.board));
      toast.success(res.data.message);
    } catch (error) {
      console.error('Error updating board:', error);
      toast.error(error.response.data.message);
      return;
    } finally {
      dispatch(setIsLoading(false));
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
      <h2 className={css.title}>Edit board</h2>

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
          Edit
        </button>
      </form>
    </div>
  );
};

export default UpdateBoardModal;
