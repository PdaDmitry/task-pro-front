import { Popconfirm } from 'antd';
import { setIsLoading } from '../../store/loader/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { removeColumn } from '../../store/columns/columnsSlise';
import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { updateCardsInColumn } from '../../store/cards/cardsSlise';

import request from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import ModalWindow from '../ModalWindow/ModalWindow';
import AddColumnModal from '../Modals/AddColumnModal/AddColumnModal';
import AddEditCardModal from '../Modals/AddEditCardModal/AddEditCardModal';
import Card from '../Card/Card';
import SortableCardWrapper from '../SortableCardWrapper/SortableCardWrapper';

import css from './Column.module.css';

const Column = ({
  title,
  columnId,
  dragActivatorRef,
  dragListeners,
  dragAttributes,
  // isDragging, // boolean
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const cardsList = useSelector(state => state.cards.cardsList);

  const [isUpdateColumn, setIsUpdateColumn] = useState(false);
  const [isOpenAddCard, setIsOpenAddCard] = useState(false);
  // const [cards, setCards] = useState([]);

  // useEffect(() => {
  //   const filtered = cardsList
  //     .filter(c => c.columnId === columnId)
  //     .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  //   setCards(filtered);
  // }, [cardsList, columnId]);

  const openModal = () => setIsUpdateColumn(true);
  const closeModal = () => setIsUpdateColumn(false);

  const openModalAddCard = () => setIsOpenAddCard(true);
  const closeModalAddCard = () => setIsOpenAddCard(false);

  const cards = cardsList
    .filter(c => c.columnId === columnId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     activationConstraint: {
  //       distance: 5,
  //     },
  //   }),
  //   // useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
  //   useSensor(TouchSensor, {
  //     activationConstraint: {
  //       // delay: 200,
  //       tolerance: 5,
  //     },
  //   })
  // );

  const handleDragEnd = async event => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cards.findIndex(c => c._id === active.id);
    const newIndex = cards.findIndex(c => c._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;
    const newOrder = arrayMove(cards, oldIndex, newIndex);

    dispatch(
      updateCardsInColumn({
        columnId,
        cards: newOrder.map((c, i) => ({ ...c, order: i })),
      })
    );

    try {
      const res = await request.patch('/cards/reorder', {
        columnId,
        cards: newOrder.map((c, i) => ({ _id: c._id, order: i })),
      });
      dispatch(updateCardsInColumn(res.data.cards));
    } catch (e) {
      console.error(e);
      toast.error('Failed to reorder cards');
    }
  };

  const handleDeleteColumn = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await request.delete('/columns/deleteColumn', { data: { columnId } });
      if (res.data.status) {
        dispatch(removeColumn(columnId));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.error('Error deleting column:', error);
      toast.error('Failed to delete column. Please try again.');
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className={css.contColumn}>
      <div className={css.columnContent}>
        <div className={css.column}>
          <div
            className={css.columnHeader}
            ref={dragActivatorRef}
            {...(dragAttributes || {})}
            {...(dragListeners || {})}
            role="button"
            tabIndex={0}
            aria-label={`Drag column ${title}`}
          >
            <h3 className={css.titleColumn}>{title}</h3>
          </div>

          <div className={css.updateDelBoard}>
            <svg className={css.updateColumnSvg} onClick={openModal}>
              <use href="/symbol-defs.svg#icon-pencil-01"></use>
            </svg>
            <Popconfirm
              title="Are you sure you want to delete this column?"
              onConfirm={handleDeleteColumn}
              okText="Confirm"
              cancelText="Cancel"
            >
              <svg className={css.deleteColumnSvg}>
                <use href="/symbol-defs.svg#icon-trash-04-1"></use>
              </svg>
            </Popconfirm>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={cards.map(card => card._id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className={css.cardList}>
              {cards.map(card => (
                <SortableCardWrapper key={card._id} id={card._id}>
                  <Card cardId={card._id} />
                </SortableCardWrapper>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>

      <button
        type="button"
        className={currentUser?.theme === 'Violet' ? css.addCardBtnViolet : css.addCardBtn}
        onClick={openModalAddCard}
      >
        <svg className={css.createCardSvg}>
          <use
            href={
              currentUser?.theme === 'Violet'
                ? '/symbol-defs.svg#icon-plus-4'
                : '/symbol-defs.svg#icon-plus-1'
            }
          ></use>
        </svg>
        Add another card
      </button>

      <ModalWindow isOpen={isUpdateColumn} onClose={closeModal}>
        <AddColumnModal
          closeModal={closeModal}
          columnId={columnId}
          forUpdateColumnTitle={title}
          isUpdateColumn={isUpdateColumn}
        />
      </ModalWindow>

      <ModalWindow isOpen={isOpenAddCard} onClose={closeModalAddCard}>
        <AddEditCardModal closeModal={closeModalAddCard} columnId={columnId} />
      </ModalWindow>
    </div>
  );
};

export default Column;
