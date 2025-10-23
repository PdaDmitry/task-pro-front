import { useSelector } from 'react-redux';
import { getPriorityColorByTheme } from '../../utils/priorityUtils';
import dayjs from 'dayjs';

import css from './Card..module.css';

const Card = ({ cardId }) => {
  const currentUser = useSelector(state => state.auth.user);
  const cardsList = useSelector(state => state.cards.cardsList);
  const currentCard = cardsList.find(card => String(card._id) === String(cardId));

  const { title, description, priority, deadline } = currentCard;

  const formattedDate = dayjs(deadline).format('DD/MM/YYYY');

  const currentPriorityColor = getPriorityColorByTheme(priority, currentUser?.theme);

  return (
    <div
      style={{
        borderLeft: `4px solid ${currentPriorityColor}`,
      }}
      className={css.contCard}
    >
      <h3 className={css.cardTitle}>{title}</h3>
      <p className={css.description}>{description}</p>
      <div className={css.dataCard}>
        <div className={css.contPrDl}>
          <div className={css.contPriority}>
            <p className={css.titleCategory}>Priority</p>
            <div className={css.priorityItem}>
              <div style={{ background: currentPriorityColor }} className={css.priorityColor}></div>
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

          <svg
            className={css.toolsIconSvg}
            //   onClick={openModal}
          >
            <use href="/symbol-defs.svg#icon-pencil-01"></use>
          </svg>

          <svg className={css.toolsIconSvg}>
            <use href="/symbol-defs.svg#icon-trash-04-1"></use>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Card;
