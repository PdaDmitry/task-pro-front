import { Popconfirm } from 'antd';
import { setIsLoading } from '../../store/loader/loaderSlice';
import { useDispatch } from 'react-redux';
import { removeColumn } from '../../store/columns/columnsSlise';

import request from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

import css from './Column.module.css';
import ModalWindow from '../ModalWindow/ModalWindow';
import AddColumnModal from '../Modals/AddColumnModal/AddColumnModal';
import { useState } from 'react';

const Column = ({ title, columnId }) => {
  const dispatch = useDispatch();

  const [isUpdateColumn, setIsUpdateColumn] = useState(false);

  const openModal = () => setIsUpdateColumn(true);
  const closeModal = () => setIsUpdateColumn(false);

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
      <h3 className={css.titleColumn}>{title}</h3>
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

      <ModalWindow isOpen={isUpdateColumn} onClose={closeModal}>
        <AddColumnModal
          closeModal={closeModal}
          columnId={columnId}
          forUpdateColumnTitle={title}
          isUpdateColumn={isUpdateColumn}
        />
      </ModalWindow>
    </div>
  );
};

export default Column;
