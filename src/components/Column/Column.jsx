import { Popconfirm } from 'antd';
import { setIsLoading } from '../../store/loader/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { removeColumn } from '../../store/columns/columnsSlise';
import { useState } from 'react';

import request from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import ModalWindow from '../ModalWindow/ModalWindow';
import AddColumnModal from '../Modals/AddColumnModal/AddColumnModal';

import css from './Column.module.css';
import AddEditCardModal from '../Modals/AddEditCardModal/AddEditCardModal';

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

  const [isUpdateColumn, setIsUpdateColumn] = useState(false);
  const [isOpenAddCard, setIsOpenAddCard] = useState(false);

  const openModal = () => setIsUpdateColumn(true);
  const closeModal = () => setIsUpdateColumn(false);

  const openModalAddCard = () => setIsOpenAddCard(true);
  const closeModalAddCard = () => setIsOpenAddCard(false);

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
        <AddEditCardModal closeModal={closeModalAddCard} />
      </ModalWindow>
    </div>
  );
};

export default Column;
