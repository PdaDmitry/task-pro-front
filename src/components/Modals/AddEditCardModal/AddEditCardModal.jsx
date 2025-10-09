import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';

import css from './AddEditCardModal.module.css';

const AddEditCardModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const activeBoard = useSelector(state => state.boards.activeBoard);
  const columnsList = useSelector(state => state.columns.columnsList);

  const order = columnsList?.length > 0 ? Math.max(...columnsList.map(c => c.order)) : -1;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    deadline: '',
    order: order + 1,
    boardId: activeBoard?._id,
    // columnId,
  });
  //   const [updateColumn, setUpdateColumn] = useState(forUpdateColumnTitle);
  const [showCalendar, setShowCalendar] = useState(false);
  const [error, setError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const priorityColors = [
    { value: 'rgba(22, 22, 22, 0.3)', label: 'Without' },
    { value: '#8fa1d0', label: 'Low' },
    { value: '#e09cb5', label: 'Medium' },
    { value: '#bedbb0', label: 'High' },
  ];

  const truncateTitle = title => {
    if (title.length <= 15) return title;
    return title.substring(0, 20) + '...';
  };

  const handleChange = e => {
    // if (isUpdateColumn) {
    //   setUpdateColumn(e.target.value);
    // } else {
    //   setFormData(prev => ({ ...prev, title: e.target.value }));
    // }

    const { name, value } = e.target;

    if (error) setError('');
    if (name === 'description') {
      if (!value.trim()) {
        setDescriptionError('Поле обязательно для заполнения');
      } else if (value.length > 190) {
        setDescriptionError('Максимум 190 символов');
      } else {
        setDescriptionError('');
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    // if (descriptionError && name === 'description') setDescriptionError('');
  };

  const handChangePriority = colorValue => {
    setFormData(prev => ({ ...prev, priority: colorValue }));
  };

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    let title = formData.title;

    // let title = isUpdateColumn ? updateColumn : formData.title;

    if (!title.trim()) {
      setError('Card name is required');
      return;
    }

    if (!formData.description.trim()) {
      setDescriptionError('Поле обязательно для заполнения');
      return;
    }

    if (formData.description.trim().length > 190) {
      setDescriptionError('Максимум 190 символов');
      return;
    }

    title = truncateTitle(title.trim());

    console.log('Form data:', formData);

    //  try {
    //    dispatch(setIsLoading(true));

    //    if (isUpdateColumn) {
    //      const res = await request.put(`/columns/updateColumn/${columnId}`, { title });
    //      dispatch(updateColumnInList(res.data.column));
    //      toast.success(res.data.message);
    //    } else {
    //      const res = await request.post('/columns/createColumn', {
    //        ...formData,
    //        title,
    //      });
    //      dispatch(addColumn(res.data.column));
    //      toast.success(res.data.message);
    //    }
    //  } catch (error) {
    //    console.error('Error creating column:', error);
    //    toast.error(error.response.data.message);
    //    return;
    //  } finally {
    //    dispatch(setIsLoading(false));
    //  }
    //  setFormData({ title: '' });
    //  setError('');

    closeModal();
  };

  return (
    <div className={css.contAddCard}>
      <svg className={css.closeBtnSvg} onClick={closeModal}>
        <use href="/symbol-defs.svg#icon-x-close-1"></use>
      </svg>
      {/* <h2 className={css.title}> {isUpdateColumn ? 'Edit column' : 'Add column'}</h2> */}
      <h2 className={css.title}>Add card</h2>

      <form onSubmit={handleSubmit}>
        {/* Board name */}
        <input
          type="text"
          placeholder="Title"
          name="title"
          //   value={isUpdateColumn ? updateColumn : formData.title}
          value={formData.title}
          onChange={handleChange}
          className={css.input}
          style={error ? { borderColor: 'red', marginBottom: '2px' } : {}}
        />
        {error && <p className={css.error}>{error}</p>}

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className={css.textarea}
          rows={4}
          style={descriptionError ? { borderColor: 'red', marginBottom: '2px' } : {}}
        />
        {descriptionError && <p className={css.error}>{descriptionError}</p>}

        {/* Radio buttons for Label color */}
        <div className={css.radioSection}>
          <h3 className={css.radioTitle}>Label color</h3>
          <ul className={css.radioGroup}>
            {priorityColors.map(color => (
              <li key={color.value} className={css.radioOption}>
                <input
                  type="radio"
                  id={`color-${color.value}`}
                  name="labelColor"
                  value={color.value}
                  checked={formData.labelColor === color.value}
                  onChange={() => handChangePriority(color.value)}
                  className={css.radioInput}
                />
                <label htmlFor={`color-${color.value}`} className={css.radioLabel}>
                  {formData.labelColor === color.value ? (
                    <MdOutlineRadioButtonChecked
                      style={{
                        width: '20px',
                        height: '20px',
                        marginRight: '8px',
                        fill: color.value,
                      }}
                    />
                  ) : (
                    <MdRadioButtonUnchecked
                      style={{
                        width: '20px',
                        height: '20px',
                        marginRight: '8px',
                        color: color.value,
                      }}
                    />
                  )}
                  <span className={css.textRadio}>{color.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className={currentUser?.theme === 'Violet' ? css.addCardBtnViolet : css.addCardtBtn}
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
          {/* {isUpdateColumn ? 'Edit' : 'Add'} */}
          Add
        </button>
      </form>
    </div>
  );
};

export default AddEditCardModal;
