import { useDispatch, useSelector } from 'react-redux';
import { getPriorityColorByTheme } from '../../utils/priorityUtils';
import { Popconfirm } from 'antd';
import { setIsLoading } from '../../store/loader/loaderSlice';
import { removeCard } from '../../store/cards/cardsSlise';
import { useState } from 'react';

import toast from 'react-hot-toast';
import request from '../../utils/axiosInstance';
import dayjs from 'dayjs';
import ModalWindow from '../ModalWindow/ModalWindow';
import AddEditCardModal from '../Modals/AddEditCardModal/AddEditCardModal';

import css from './Card.module.css';

const Card = ({ cardId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const cardsList = useSelector(state => state.cards.cardsList);
  const currentCard = cardsList.find(card => String(card._id) === String(cardId));

  const [isOpenUpdateCard, setIsOpenUpdateCard] = useState(false);

  const openModalUpdateCard = () => setIsOpenUpdateCard(true);
  const closeModalUpdateCard = () => setIsOpenUpdateCard(false);

  const { title, description, priority, deadline } = currentCard;

  const formattedDate = dayjs(deadline).format('DD/MM/YYYY');
  const currentPriorityColor = getPriorityColorByTheme(priority, currentUser?.theme);

  const handleDeleteCard = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await request.delete('/cards/deleteCard', { data: { cardId } });
      if (res.data.status) {
        dispatch(removeCard(cardId));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Failed to delete card. Please try again.');
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div
      style={{
        borderLeft: `4px solid ${currentPriorityColor}`,
      }}
      className={css.contCard}
    >
      <h3 className={css.cardTitle}>{title}</h3>
      <p className={css.description}>
        {description.length > 73 ? description.slice(0, 73) + '…' : description}
      </p>
      <div className={css.dataCard}>
        <div className={css.contPrDl}>
          <div className={css.contPriority}>
            <p className={css.titleCategory}>Priority</p>
            <div className={css.priorityItem}>
              <div
                style={{ backgroundColor: currentPriorityColor }}
                className={css.priorityColor}
              ></div>
              <p className={css.priorityText}>{priority}</p>
            </div>
          </div>

          <div className={css.contDeadline}>
            <p className={css.titleCategory}>Deadline</p>
            <p className={css.deadlineDate}>{formattedDate}</p>
          </div>
        </div>

        <div className={css.toolsCards}>
          <svg className={css.toolsIconSvg}>
            <use href="/symbol-defs.svg#icon-bell-01"></use>
          </svg>

          <svg className={css.toolsIconSvg}>
            <use href="/symbol-defs.svg#icon-arrow-circle-broken-right-2"></use>
          </svg>

          <svg className={css.toolsIconSvg} onClick={openModalUpdateCard}>
            <use href="/symbol-defs.svg#icon-pencil-01"></use>
          </svg>

          <Popconfirm
            title="Are you sure you want to delete this card?"
            onConfirm={handleDeleteCard}
            okText="Confirm"
            cancelText="Cancel"
          >
            <svg className={css.toolsIconSvg}>
              <use href="/symbol-defs.svg#icon-trash-04-1"></use>
            </svg>
          </Popconfirm>
        </div>
      </div>

      <ModalWindow isOpen={isOpenUpdateCard} onClose={closeModalUpdateCard}>
        <AddEditCardModal
          closeModal={closeModalUpdateCard}
          card={currentCard}
          isUpdateCard={true}
        />
      </ModalWindow>
    </div>
  );
};

export default Card;
