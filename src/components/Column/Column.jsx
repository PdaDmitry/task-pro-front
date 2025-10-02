import { Popconfirm } from 'antd';
import { setIsLoading } from '../../store/loader/loaderSlice';
import { useDispatch } from 'react-redux';
import { removeColumn } from '../../store/columns/columnsSlise';

import request from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

import css from './Column.module.css';

const Column = ({ title, columnId }) => {
  const dispatch = useDispatch();

  const handleDeleteColumn = async columnId => {
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
        <svg
          className={css.updateColumnSvg}
          //   onClick={openUpdateBoardModal}
        >
          <use href="/symbol-defs.svg#icon-pencil-01"></use>
        </svg>
        <Popconfirm
          title="Are you sure you want to delete this column?"
          onConfirm={() => handleDeleteColumn(columnId)}
          okText="Confirm"
          cancelText="Cancel"
        >
          <svg className={css.deleteColumnSvg}>
            <use href="/symbol-defs.svg#icon-trash-04-1"></use>
          </svg>
        </Popconfirm>
      </div>
    </div>
  );
};

export default Column;
