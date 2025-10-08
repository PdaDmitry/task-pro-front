import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import request from '../../utils/axiosInstance';

import ModalWindow from '../ModalWindow/ModalWindow';
import AddColumnModal from '../Modals/AddColumnModal/AddColumnModal';
import Column from '../Column/Column';

import css from './ActiveBoard.module.css';
import { setColumnsList } from '../../store/columns/columnsSlise';
// import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const ActiveBoard = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.user);
  const activeBoard = useSelector(state => state.boards.activeBoard);
  const columnsList = useSelector(state => state.columns.columnsList);

  // console.log('columnsList', columnsList);

  const [isHovered, setIsHovered] = useState(false);
  const [isAddColumn, setIsAddColumn] = useState(false);
  const [columns, setColumns] = useState([]); //////////////////////////////

  const openModal = () => setIsAddColumn(true);
  const closeModal = () => setIsAddColumn(false);

  // ============================================================================

  useEffect(() => {
    if (columnsList?.length) {
      const sorted = [...columnsList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setColumns(sorted);
    } else {
      setColumns([]);
    }
  }, [columnsList]);

  const handleDragEnd = async result => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    if (type === 'COLUMN') {
      const newColumns = reorder(columns, source.index, destination.index);
      setColumns(newColumns);

      dispatch(setColumnsList(newColumns));

      try {
        await request.patch('/columns/reorder', {
          columns: newColumns.map((c, i) => ({ _id: c._id, order: i })),
        });
      } catch (err) {
        console.error('Failed to persist columns order', err);
      }
    }
  };

  if (!activeBoard) return null;

  // ============================================================================

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
        {/* ============================================================================ */}
        {/* {columnsList?.length > 0 && (
          <ul className={css.columnsList}>
            {columnsList
              ?.slice()
              .sort((a, b) => a.order - b.order)
              .map(col => (
                <li key={col._id} className={css.columnItem}>
                  <Column title={col.title} columnId={col._id} />
                </li>
              ))}
          </ul>
        )} */}
        {/* ============================================================================ */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={`board-${activeBoard._id}`} direction="horizontal" type="COLUMN">
            {provided => (
              <ul className={css.columnsList} {...provided.droppableProps} ref={provided.innerRef}>
                {columns.map((col, index) => (
                  <Draggable key={String(col._id)} draggableId={String(col._id)} index={index}>
                    {(draggableProvided, snapshot) => (
                      <li
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        className={css.columnItem}
                        style={{
                          ...draggableProvided.draggableProps.style,
                          /* визуальные подсказки при перетаскивании */
                          boxShadow: snapshot.isDragging
                            ? '0 6px 20px rgba(0,0,0,0.12)'
                            : undefined,
                          transition: snapshot.isDragging ? 'none' : 'transform 150ms ease',
                        }}
                      >
                        {/* Передаём dragHandleProps в Column, чтобы перетаскивать только за заголовок */}
                        <Column
                          columnId={col._id}
                          title={col.title}
                          dragHandleProps={draggableProvided.dragHandleProps}
                        />
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        {/* ============================================================================ */}

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
