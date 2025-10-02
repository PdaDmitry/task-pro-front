import { useState } from 'react';
import { useSelector } from 'react-redux';
// import request from '../../utils/axiosInstance';

import ModalWindow from '../ModalWindow/ModalWindow';
import AddColumnModal from '../Modals/AddColumnModal/AddColumnModal';

import css from './ActiveBoard.module.css';
import Column from '../Column/Column';

const ActiveBoard = () => {
  const currentUser = useSelector(state => state.auth.user);
  const activeBoard = useSelector(state => state.boards.activeBoard);
  const columnsList = useSelector(state => state.columns.columnsList);

  const [isHovered, setIsHovered] = useState(false);
  const [isAddColumn, setIsAddColumn] = useState(false);

  const openModal = () => setIsAddColumn(true);
  const closeModal = () => setIsAddColumn(false);

  return (
    <div className={css.contActiveBoard}>
      <div
        className={css.contTitleBoard}
        style={{
          color: currentUser?.theme && activeBoard?.background !== 'bgIcon0' ? '#161616' : '',
        }}
      >
        <h2
          className={`${css.titleBoard} ${
            activeBoard?.background !== 'bgIcon0' ? css.background : ''
          }`}
        >
          {activeBoard?.title}
        </h2>
        <div
          className={`${css.contFilter} ${
            activeBoard?.background !== 'bgIcon0' ? css.background : ''
          }`}
        >
          <svg className={css.filterSvg}>
            <use href="/symbol-defs.svg#icon-filter"></use>
          </svg>
          <p className={css.titleFilter}>Filters</p>
        </div>
      </div>
      <div className={css.contColumnsBtnAdd}>
        {columnsList?.length > 0 && (
          <ul className={css.columnsList}>
            {columnsList
              ?.slice()
              .sort((a, b) => a.order - b.order)
              .map(col => (
                <li key={col._id} className={css.columnItem}>
                  <Column title={col.title} columnId={col._id} />

                  {/* карточки задач */}
                </li>
              ))}
          </ul>
        )}

        <button
          type="submit"
          className={css.addColumnBtn}
          onClick={openModal}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg className={css.createColumnSvg}>
            {currentUser?.theme === 'Violet' ? (
              <use
                href={
                  isHovered
                    ? '/iconsSVG/symbol-defs-2.svg#icon-normal-2'
                    : '/iconsSVG/symbol-defs-2.svg#icon-hover-1'
                }
              ></use>
            ) : (
              <use
                href={isHovered ? '/symbol-defs.svg#icon-hover' : '/symbol-defs.svg#icon-normal'}
              ></use>
            )}
          </svg>
          Add another column
        </button>
      </div>

      <ModalWindow isOpen={isAddColumn} onClose={closeModal}>
        <AddColumnModal closeModal={closeModal} />
      </ModalWindow>
    </div>
  );
};

export default ActiveBoard;
