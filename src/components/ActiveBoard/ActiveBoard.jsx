// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setColumnsList } from '../../store/columns/columnsSlise';
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   MouseSensor,
//   TouchSensor,
// } from '@dnd-kit/core';
// import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';

// import SortableColumnWrapper from '../SortableColumnWrapper/SortableColumnWrapper';
// import request from '../../utils/axiosInstance';
// import ModalWindow from '../ModalWindow/ModalWindow';
// import AddColumnModal from '../Modals/AddColumnModal/AddColumnModal';
// import Column from '../Column/Column';

// import css from './ActiveBoard.module.css';

// const ActiveBoard = () => {
//   const dispatch = useDispatch();

//   const currentUser = useSelector(state => state.auth.user);
//   const activeBoard = useSelector(state => state.boards.activeBoard);
//   const columnsList = useSelector(state => state.columns.columnsList);

//   const [isHovered, setIsHovered] = useState(false);
//   const [isAddColumn, setIsAddColumn] = useState(false);
//   const [columns, setColumns] = useState([]);

//   const openModal = () => setIsAddColumn(true);
//   const closeModal = () => setIsAddColumn(false);

//   // ============================================================================

//   useEffect(() => {
//     if (columnsList?.length) {
//       const sorted = [...columnsList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
//       setColumns(sorted);
//     } else {
//       setColumns([]);
//     }
//   }, [columnsList]);

//   const sensors = useSensors(
//     // useSensor(PointerSensor),
//     useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
//     useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
//   );

//   const handleDragEnd = async event => {
//     const { active, over } = event;
//     if (!over) return;
//     if (String(active.id) === String(over.id)) return;

//     const oldIndex = columns.findIndex(c => String(c._id) === String(active.id));
//     const newIndex = columns.findIndex(c => String(c._id) === String(over.id));
//     if (oldIndex === -1 || newIndex === -1) return;

//     const newOrder = arrayMove(columns, oldIndex, newIndex);
//     setColumns(newOrder);

//     try {
//       const res = await request.patch('/columns/reorder', {
//         columns: newOrder.map((c, i) => ({ _id: c._id, order: i })),
//         boardId: activeBoard._id,
//       });

//       dispatch(setColumnsList(res.data.columns));
//     } catch (err) {
//       console.error('Failed to preserve columns order', err);
//     }
//   };

//   const handleDragStart = () => {
//     document.body.style.userSelect = 'none';
//     document.querySelector(`.${css.contColumnsBtnAdd}`).style.overflowY = 'hidden';
//   };

//   const handleDragFinalize = () => {
//     document.body.style.userSelect = '';
//     document.querySelector(`.${css.contColumnsBtnAdd}`).style.overflowY = '';
//   };

//   // ============================================================================

//   return (
//     <div className={css.contActiveBoard}>
//       <div
//         className={css.contTitleBoard}
//         style={{
//           color: currentUser?.theme && activeBoard?.background !== 'bgIcon0' ? '#161616' : '',
//         }}
//       >
//         <h2
//           className={`${css.titleBoard} ${
//             activeBoard?.background !== 'bgIcon0' ? css.background : ''
//           }`}
//         >
//           {activeBoard?.title}
//         </h2>
//         <div
//           className={`${css.contFilter} ${
//             activeBoard?.background !== 'bgIcon0' ? css.background : ''
//           }`}
//         >
//           <svg className={css.filterSvg}>
//             <use href="/symbol-defs.svg#icon-filter"></use>
//           </svg>
//           <p className={css.titleFilter}>Filters</p>
//         </div>
//       </div>
//       <div className={css.contColumnsBtnAdd}>
//         {/* ============================================================================ */}

//         {columnsList?.length > 0 && (
//           <DndContext
//             sensors={sensors}
//             collisionDetection={closestCenter}
//             onDragStart={handleDragStart}
//             onDragEnd={e => {
//               handleDragEnd(e);
//               handleDragFinalize();
//             }}
//             onDragCancel={handleDragFinalize}
//           >
//             <SortableContext
//               items={columns.map(c => String(c._id))}
//               strategy={horizontalListSortingStrategy}
//             >
//               <ul className={css.columnsList}>
//                 {columns.map(col => (
//                   <SortableColumnWrapper key={String(col._id)} id={String(col._id)}>
//                     <Column columnId={col._id} title={col.title} />
//                   </SortableColumnWrapper>
//                 ))}
//               </ul>
//             </SortableContext>
//           </DndContext>
//         )}

//         {/* ============================================================================ */}

//         <button
//           type="button"
//           className={css.addColumnBtn}
//           onClick={openModal}
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           <svg className={css.createColumnSvg}>
//             {currentUser?.theme === 'Violet' ? (
//               <use
//                 href={
//                   isHovered
//                     ? '/iconsSVG/symbol-defs-2.svg#icon-normal-2'
//                     : '/iconsSVG/symbol-defs-2.svg#icon-hover-1'
//                 }
//               ></use>
//             ) : (
//               <use
//                 href={isHovered ? '/symbol-defs.svg#icon-hover' : '/symbol-defs.svg#icon-normal'}
//               ></use>
//             )}
//           </svg>
//           Add another column
//         </button>
//       </div>

//       <ModalWindow isOpen={isAddColumn} onClose={closeModal}>
//         <AddColumnModal closeModal={closeModal} />
//       </ModalWindow>
//     </div>
//   );
// };

// export default ActiveBoard;

// =============================================================================================
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setColumnsList } from '../../store/columns/columnsSlise';
import { setCardsList } from '../../store/cards/cardsSlise';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';

import SortableColumnWrapper from '../SortableColumnWrapper/SortableColumnWrapper';
import SortableCardWrapper from '../SortableCardWrapper/SortableCardWrapper';
import request from '../../utils/axiosInstance';
import ModalWindow from '../ModalWindow/ModalWindow';
import AddColumnModal from '../Modals/AddColumnModal/AddColumnModal';
import Column from '../Column/Column';
import Card from '../Card/Card';

import css from './ActiveBoard.module.css';
import FiltersModal from '../Modals/FiltersModal/FiltersModal';

const ActiveBoard = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.user);
  const activeBoard = useSelector(state => state.boards.activeBoard);
  const columnsList = useSelector(state => state.columns.columnsList);
  const cardsList = useSelector(state => state.cards.cardsList);

  const [isHovered, setIsHovered] = useState(false);
  const [isAddColumn, setIsAddColumn] = useState(false);
  const [columns, setColumns] = useState([]);
  const [snapshotCards, setSnapshotCards] = useState(null);
  const [activeDrag, setActiveDrag] = useState(null);
  const [addFilter, setAddFilter] = useState(false);

  const openModal = () => setIsAddColumn(true);
  const closeModal = () => setIsAddColumn(false);

  const openFilterModal = () => setAddFilter(true);
  const closeFilterModal = () => setAddFilter(false);

  // ============================================================================

  useEffect(() => {
    if (columnsList?.length) {
      const sorted = [...columnsList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setColumns(sorted);
    } else {
      setColumns([]);
    }
  }, [columnsList]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const handleDragStart = event => {
    const { active } = event;
    setSnapshotCards([...cardsList]);
    setActiveDrag({
      id: active.id,
      type: active.data.current?.type,
    });
    document.body.style.userSelect = 'none';
    const container = document.querySelector(`.${css.contColumnsBtnAdd}`);
    if (container) container.style.overflowY = 'hidden';
  };

  const handleDragFinalize = () => {
    setActiveDrag(null);
    document.body.style.userSelect = '';
    const container = document.querySelector(`.${css.contColumnsBtnAdd}`);
    if (container) container.style.overflowY = '';
  };

  const handleDragCancel = () => {
    if (snapshotCards) dispatch(setCardsList(snapshotCards));
    handleDragFinalize();
  };

  const handleDragEnd = async event => {
    const { active, over } = event;
    if (!over) {
      handleDragFinalize();
      return;
    }

    const activeType = active.data.current?.type;

    // === MOVING COLUMNS ===
    if (activeType === 'column') {
      if (String(active.id) === String(over.id)) {
        handleDragFinalize();
        return;
      }

      const oldIndex = columns.findIndex(c => String(c._id) === String(active.id));
      const newIndex = columns.findIndex(c => String(c._id) === String(over.id));
      if (oldIndex === -1 || newIndex === -1) {
        handleDragFinalize();
        return;
      }

      const newOrder = arrayMove(columns, oldIndex, newIndex);
      setColumns(newOrder);

      try {
        const res = await request.patch('/columns/reorder', {
          columns: newOrder.map((c, i) => ({ _id: c._id, order: i })),
          boardId: activeBoard._id,
        });
        dispatch(setColumnsList(res.data.columns));
      } catch (err) {
        console.error('Failed to preserve columns order', err);
      }

      handleDragFinalize();
      return;
    }

    // === MOVING CARDS ===
    if (activeType === 'card') {
      const activeCard = cardsList.find(c => String(c._id) === String(active.id));
      if (!activeCard) {
        handleDragFinalize();
        return;
      }

      let targetColumnId = null;
      let overCard = null;

      const overType = over.data.current?.type;
      if (overType === 'card') {
        overCard = cardsList.find(c => String(c._id) === String(over.id));
        if (overCard) targetColumnId = overCard.columnId;
      } else if (overType === 'column') {
        targetColumnId = over.id;
      }

      if (!targetColumnId) {
        handleDragFinalize();
        return;
      }

      const sourceColumnId = activeCard.columnId;

      if (sourceColumnId === targetColumnId) {
        // Moving within one column
        const cardsInColumn = cardsList
          .filter(c => c.columnId === sourceColumnId)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const oldIndex = cardsInColumn.findIndex(c => c._id === active.id);
        const newIndex = overCard
          ? cardsInColumn.findIndex(c => c._id === over.id)
          : cardsInColumn.length - 1;

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
          handleDragFinalize();
          return;
        }

        const newOrder = arrayMove(cardsInColumn, oldIndex, newIndex);
        const updatedCards = cardsList.map(card => {
          if (card.columnId !== sourceColumnId) return card;
          const found = newOrder.find(nc => nc._id === card._id);
          return found ? { ...found, order: newOrder.indexOf(found) } : card;
        });

        dispatch(setCardsList(updatedCards));

        try {
          await request.patch('/cards/reorder', {
            columnId: sourceColumnId,
            cards: newOrder.map((c, i) => ({ _id: c._id, order: i })),
          });
        } catch (err) {
          console.error('Failed to persist cards order', err);
        }
      } else {
        // Moving between columns
        const sourceCards = cardsList
          .filter(c => c.columnId === sourceColumnId)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const destCards = cardsList
          .filter(c => c.columnId === targetColumnId)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const movedCardNew = { ...activeCard, columnId: targetColumnId };

        const sourceCardsNew = sourceCards
          .filter(c => c._id !== active.id)
          .map((c, i) => ({ ...c, order: i }));
        const destCardsNew = [...destCards];
        const insertIndex =
          overCard && overCard.columnId === targetColumnId
            ? destCards.findIndex(c => c._id === over.id)
            : destCards.length;

        destCardsNew.splice(insertIndex, 0, movedCardNew);
        const destCardsUpdated = destCardsNew.map((c, i) => ({ ...c, order: i }));

        const updatedCards = cardsList.map(card => {
          const inSource = sourceCardsNew.find(sc => sc._id === card._id);
          if (inSource) return inSource;
          const inDest = destCardsUpdated.find(dc => dc._id === card._id);
          if (inDest) return inDest;
          return card;
        });

        dispatch(setCardsList(updatedCards));

        try {
          await request.put(`/cards/updateCard/${movedCardNew._id}`, { columnId: targetColumnId });
          await request.patch('/cards/reorder', {
            columnId: sourceColumnId,
            cards: sourceCardsNew.map((c, i) => ({ _id: c._id, order: i })),
          });
          await request.patch('/cards/reorder', {
            columnId: targetColumnId,
            cards: destCardsUpdated.map((c, i) => ({ _id: c._id, order: i })),
          });
        } catch (err) {
          console.error('Failed to persist moved card', err);
        }
      }

      handleDragFinalize();
      return;
    }

    handleDragFinalize();
  };

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
        {/* <div
          className={`${css.contFilter} ${
            activeBoard?.background !== 'bgIcon0' ? css.background : ''
          }`}
        >
          <svg className={css.filterSvg}>
            <use href="/symbol-defs.svg#icon-filter"></use>
          </svg>
          <p className={css.titleFilter}>Filters</p>
        </div> */}

        <button
          type="button"
          className={`${css.contFilter} ${
            activeBoard?.background !== 'bgIcon0' ? css.background : ''
          }`}
          onClick={() => {
            console.log('Открыть фильтры');
          }}
        >
          <svg className={css.filterSvg}>
            <use href="/symbol-defs.svg#icon-filter"></use>
          </svg>
          <p className={css.titleFilter}>Filters</p>
        </button>
      </div>

      <div className={css.contColumnsBtnAdd}>
        {columnsList?.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={e => {
              handleDragEnd(e);
              handleDragFinalize();
            }}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={columns.map(c => String(c._id))}
              strategy={horizontalListSortingStrategy}
            >
              <ul className={css.columnsList}>
                {columns.map(col => (
                  <SortableColumnWrapper
                    key={String(col._id)}
                    id={String(col._id)}
                    data={{ type: 'column' }}
                  >
                    <Column columnId={col._id} title={col.title} />
                  </SortableColumnWrapper>
                ))}
              </ul>
            </SortableContext>

            {/* DragOverlay for cards and columns */}
            <DragOverlay>
              {activeDrag?.type === 'column' && activeDrag.id && (
                <Column
                  columnId={activeDrag.id}
                  title={columnsList.find(c => c._id === activeDrag.id)?.title}
                />
              )}
              {activeDrag?.type === 'card' && activeDrag.id && <Card cardId={activeDrag.id} />}
            </DragOverlay>
          </DndContext>
        )}

        <button
          type="button"
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

      <ModalWindow isOpen={addFilter} onClose={closeFilterModal}>
        <FiltersModal closeModal={closeFilterModal} />
      </ModalWindow>
    </div>
  );
};

export default ActiveBoard;
