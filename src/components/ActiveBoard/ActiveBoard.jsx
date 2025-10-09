import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setColumnsList } from '../../store/columns/columnsSlise';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';

import SortableColumnWrapper from '../SortableColumnWrapper/SortableColumnWrapper';
import request from '../../utils/axiosInstance';
import ModalWindow from '../ModalWindow/ModalWindow';
import AddColumnModal from '../Modals/AddColumnModal/AddColumnModal';
import Column from '../Column/Column';

import css from './ActiveBoard.module.css';

const ActiveBoard = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.user);
  const activeBoard = useSelector(state => state.boards.activeBoard);
  const columnsList = useSelector(state => state.columns.columnsList);

  const [isHovered, setIsHovered] = useState(false);
  const [isAddColumn, setIsAddColumn] = useState(false);
  const [columns, setColumns] = useState([]);

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

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async event => {
    const { active, over } = event;
    if (!over) return;
    if (String(active.id) === String(over.id)) return;

    const oldIndex = columns.findIndex(c => String(c._id) === String(active.id));
    const newIndex = columns.findIndex(c => String(c._id) === String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(columns, oldIndex, newIndex);
    setColumns(newOrder);

    try {
      const res = await request.patch('/columns/reorder', {
        columns: newOrder.map((c, i) => ({ _id: c._id, order: i })),
        boardId: activeBoard._id,
      });

      dispatch(setColumnsList(res.data.columns));
    } catch (err) {
      console.error('Failed to persist columns order', err);
    }
  };

  const handleDragStart = () => {
    document.body.style.userSelect = 'none';
  };
  const handleDragFinalize = () => {
    document.body.style.userSelect = '';
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={e => {
            handleDragEnd(e);
            handleDragFinalize();
          }}
          onDragCancel={handleDragFinalize}
        >
          <SortableContext
            items={columns.map(c => String(c._id))}
            strategy={horizontalListSortingStrategy}
          >
            <ul className={css.columnsList}>
              {columns.map(col => (
                <SortableColumnWrapper key={String(col._id)} id={String(col._id)}>
                  <Column columnId={col._id} title={col.title} />
                </SortableColumnWrapper>
              ))}
            </ul>
          </SortableContext>
        </DndContext>

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
