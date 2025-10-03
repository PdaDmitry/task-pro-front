import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import css from './AddColumnModal.module.css';
import { setIsLoading } from '../../../store/loader/loaderSlice';
import toast from 'react-hot-toast';
import request from '../../../utils/axiosInstance';
import { addColumn, updateColumnInList } from '../../../store/columns/columnsSlise';

const AddColumnModal = ({ closeModal, columnId, forUpdateColumnTitle, isUpdateColumn = false }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const activeBoard = useSelector(state => state.boards.activeBoard);
  const columnsList = useSelector(state => state.columns.columnsList);

  const order = columnsList?.length > 0 ? Math.max(...columnsList.map(c => c.order)) : -1;

  const [formData, setFormData] = useState({
    title: '',
    order: order + 1,
    boardId: activeBoard?._id,
  });
  const [updateColumn, setUpdateColumn] = useState(forUpdateColumnTitle);
  const [error, setError] = useState('');

  const handleChange = e => {
    if (isUpdateColumn) {
      setUpdateColumn(e.target.value);
    } else {
      setFormData(prev => ({ ...prev, title: e.target.value }));
    }

    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const title = isUpdateColumn ? updateColumn : formData.title;

    if (!title.trim()) {
      setError('Column name is required');
      return;
    }

    try {
      dispatch(setIsLoading(true));

      if (isUpdateColumn) {
        const res = await request.put(`/columns/updateColumn/${columnId}`, { title });
        dispatch(updateColumnInList(res.data.column));
        toast.success(res.data.message);
      } else {
        const res = await request.post('/columns/createColumn', formData);
        dispatch(addColumn(res.data.column));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error('Error creating column:', error);
      toast.error(error.response.data.message);
      return;
    } finally {
      dispatch(setIsLoading(false));
    }
    setFormData({ title: '' });
    setError('');

    closeModal();
  };

  return (
    <div className={css.contAddColumn}>
      <svg className={css.closeBtnSvg} onClick={closeModal}>
        <use href="/symbol-defs.svg#icon-x-close-1"></use>
      </svg>
      <h2 className={css.title}> {isUpdateColumn ? 'Edit column' : 'Add column'}</h2>

      <form onSubmit={handleSubmit}>
        {/* Board name */}
        <input
          type="text"
          placeholder="Title"
          value={isUpdateColumn ? updateColumn : formData.title}
          onChange={handleChange}
          className={css.input}
          style={error ? { borderColor: 'red', marginBottom: '2px' } : {}}
        />
        {error && <p className={css.error}>{error}</p>}

        <button
          type="submit"
          className={currentUser?.theme === 'Violet' ? css.addColumnBtnViolet : css.addColumntBtn}
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
          {isUpdateColumn ? 'Edit' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default AddColumnModal;
