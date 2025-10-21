import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineRadioButtonChecked, MdCircle } from 'react-icons/md';

import css from './AddEditCardModal.module.css';
import dayjs from 'dayjs';
import Calendar from '../../Calendar/Calendar';

const priorityColors = [
  { value: '#8fa1d0', label: 'Low' },
  { value: '#e09cb5', label: 'Medium' },
  { value: '#bedbb0', label: 'High' },
  { value: 'rgba(22, 22, 22, 0.3)', darkValue: 'rgba(255, 255, 255, 0.3)', label: 'Without' },
];

const AddEditCardModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const today = dayjs();
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
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    description: '',
  });

  const validateTitle = value => {
    if (!value.trim()) return 'Card name is required!';
    if (value.length > 20) return 'Maximum 20 characters';
  };

  const validateDescription = value => {
    if (!value.trim()) return 'The "Description" field cannot be empty.!';
    if (value.length > 90) return 'Maximum 90 characters';
  };

  const handChangePriority = item => {
    setFormData(prev => ({ ...prev, priority: item.label }));
  };

  // const handleCalendarToggle = () => {
  //   setShowCalendar(!showCalendar);
  // };

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    let error = '';
    if (name === 'title') error = validateTitle(value);
    if (name === 'description') error = validateDescription(value);

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const titleError = validateTitle(formData.title);
    const descriptionError = validateDescription(formData.description);

    const newErrors = {
      title: titleError,
      description: descriptionError,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err)) {
      return;
    }

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
    <>
      {/* <div className={css.contAddCard}> */}
      <div className={`${css.contAddCard} ${showCalendar ? css.dimmed : ''}`}>
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
            value={formData.title}
            onChange={handleChange}
            className={css.input}
            style={errors.title ? { borderColor: 'red', marginBottom: '2px' } : {}}
          />
          {errors.title && <p className={css.error}>{errors.title}</p>}

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className={css.textarea}
            rows={4}
            style={errors.description ? { borderColor: 'red', marginBottom: '2px' } : {}}
          />
          {errors.description && <p className={css.error}>{errors.description}</p>}

          {/* Radio buttons for Label color */}
          <div className={css.radioSection}>
            <h3 className={css.radioTitle}>Label color</h3>
            <ul className={css.radioGroup}>
              {priorityColors.map(color => {
                const fillColor =
                  currentUser?.theme === 'Dark' && color.darkValue ? color.darkValue : color.value;

                return (
                  <li key={color.value} className={css.radioOption}>
                    <input
                      type="radio"
                      id={`color-${color.value}`}
                      name="labelColor"
                      value={color.value}
                      checked={formData.priority === color.value}
                      onChange={() => handChangePriority(color)}
                      className={css.radioInput}
                    />
                    <label htmlFor={`color-${color.value}`} className={css.radioLabel}>
                      <div className={css.radioIcon}>
                        {formData.priority === color.label ? (
                          <MdOutlineRadioButtonChecked
                            style={{ width: '100%', height: '100%', fill: fillColor }}
                          />
                        ) : (
                          <MdCircle style={{ width: '100%', height: '100%', fill: fillColor }} />
                        )}
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>

          <h3 className={css.titleDeadline}>Deadline</h3>
          <div className={css.currentDate}>
            <p className={currentUser?.theme === 'Violet' ? css.textDateViolet : css.textDate}>
              {/* {formData.deadline
                ? `${dayjs(formData.deadline, 'DD/MM/YYYY').format('dddd').slice(0, 2)}, ${dayjs(
                    formData.deadline,
                    'DD/MM/YYYY'
                  ).format('MMMM D')}`
                : `Today, ${today.format('MMMM D')}`} */}
              {formData.deadline
                ? `${dayjs(formData.deadline).format('dddd').slice(0, 2)}, ${dayjs(
                    formData.deadline
                  ).format('MMMM D')}`
                : `Today, ${today.format('MMMM D')}`}
            </p>

            {/* <svg className={css.openCalendarSvg} onClick={() => setShowCalendar(true)}>
              <use
                href={
                  currentUser?.theme === 'Violet'
                    ? '/symbol-defs.svg#icon-chevron-down-4'
                    : '/symbol-defs.svg#icon-chevron-down-3'
                }
              ></use>
            </svg> */}
            <div className={css.openCalendar}>
              <Calendar
                formData={formData}
                setFormData={setFormData}
                setShowCalendar={setShowCalendar}
              />
            </div>
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

      {/* {showCalendar && (
        <div className={css.calendarWrapper}>
          <Calendar
            formData={formData}
            setFormData={setFormData}
            setShowCalendar={setShowCalendar}
          />
        </div>
      )} */}
    </>
  );
};

export default AddEditCardModal;
