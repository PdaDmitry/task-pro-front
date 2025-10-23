import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineRadioButtonChecked, MdCircle } from 'react-icons/md';

import css from './AddEditCardModal.module.css';
import dayjs from 'dayjs';
import Calendar from '../../Calendar/Calendar';
import { addCard, removeCardList } from '../../../store/cards/cardsSlise';
import request from '../../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { setIsLoading } from '../../../store/loader/loaderSlice';
import { PRIORITY_COLORS } from '../../../utils/constants';

const AddEditCardModal = ({ closeModal, columnId }) => {
  const dispatch = useDispatch();
  const today = dayjs();
  const currentUser = useSelector(state => state.auth.user);
  const activeBoard = useSelector(state => state.boards.activeBoard);
  const cardsList = useSelector(state => state.cards.cardsList);
  const cardsInActiveColumn = cardsList.filter(card => card.columnId === columnId);

  // console.log('cardList', cardsList);

  const order =
    cardsInActiveColumn.length > 0
      ? Math.max(...cardsInActiveColumn.map(card => card.order)) + 1
      : 0;

  const initialFormData = {
    title: '',
    description: '',
    order,
    boardId: activeBoard?._id,
    columnId,
  };

  const [formData, setFormData] = useState(initialFormData);
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

    try {
      dispatch(setIsLoading(true));

      const res = await request.post('/cards/createCard', formData);

      if (res.data.status) {
        dispatch(addCard(res.data.card)); // добавляем в redux
        toast.success('Card successfully created');
        closeModal();
      }

      //  if (isUpdateColumn) {
      //    const res = await request.put(`/columns/updateColumn/${columnId}`, { title });
      //    dispatch(updateColumnInList(res.data.column));
      //    toast.success(res.data.message);
      //  } else {
      //    const res = await request.post('/columns/createColumn', {
      //      ...formData,
      //      title,
      //    });
      //    dispatch(addColumn(res.data.column));
      //    toast.success(res.data.message);
      //  }
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error(error.response.data.message);
      return;
    } finally {
      dispatch(setIsLoading(false));
    }
    setFormData(initialFormData);
    setErrors({ title: '', description: '' });
    // dispatch(removeCardList());
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
              {PRIORITY_COLORS.map(color => {
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
              {formData.deadline
                ? `${dayjs(formData.deadline).format('YYYY')}, ${dayjs(formData.deadline).format(
                    'MMMM D'
                  )}`
                : `Today, ${today.format('MMMM D')}`}
            </p>

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
    </>
  );
};

export default AddEditCardModal;
