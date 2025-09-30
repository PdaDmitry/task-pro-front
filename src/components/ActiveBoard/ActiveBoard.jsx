import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import request from '../../utils/axiosInstance';

import css from './ActiveBoard.module.css';

const ActiveBoard = () => {
  const currentUser = useSelector(state => state.auth.user);
  const activeBoard = useSelector(state => state.boards.activeBoard);

  const [isHovered, setIsHovered] = useState(false);
  // console.log('activeBoard', activeBoard);
  //   const [boardData, setBoardData] = useState(null);
  //   const [loading, setLoading] = useState(false);

  //   useEffect(() => {
  // if (!activeBoard?.activeBoardId) return;
  // setLoading(true);

  // const fetchBoard = async () => {
  //   try {
  //     const res = await request.get(`/boards/${activeBoardId}/full`);
  //     setBoardData(res.data); // { title, columns: [...] }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // fetchBoard();
  //   }, [activeBoard?.activeBoardId]);

  //   if (loading) return <p>Loading...</p>;
  //   if (!boardData) return <p>No data</p>;

  return (
    <div className={css.contActiveBoard}>
      <div className={css.contTitleBoard}>
        <h2 className={css.titleBoard}>{activeBoard?.title}</h2>
        <div className={css.contFilter}>
          <svg className={css.filterSvg}>
            <use href="/symbol-defs.svg#icon-filter"></use>
          </svg>
          <p className={css.titleFilter}>Filters</p>
        </div>
      </div>
      <div>
        <button
          type="submit"
          className={css.addColumnBtn}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg
            className={css.createColumnSvg}
            style={
              currentUser?.theme === 'Violet' && isHovered
                ? { fill: '#696dee' }
                : { fill: 'a3a5e7' }
            }
          >
            {currentUser?.theme === 'Violet' ? (
              <use
                href={isHovered ? '/symbol-defs.svg#icon-plus-1' : '/symbol-defs.svg#icon-plus-2'}
              ></use>
            ) : (
              <use
                href={isHovered ? '/symbol-defs.svg#icon-hover' : '/symbol-defs.svg#icon-normal'}
              ></use>
            )}
          </svg>
          {/* <svg className={css.createColumnSvg}>
            <use
              href={
                currentUser?.theme === 'Violet'
                  ? '/symbol-defs.svg#icon-plus-2'
                  : '/symbol-defs.svg#icon-plus-1'
              }
            ></use>
          </svg> */}
          Add another column
        </button>
      </div>
    </div>

    // <div className={css.boardContent}>
    //   {boardData.columns.map(col => (
    //     <div key={col._id} className={css.column}>
    //       <h3>{col.title}</h3>
    //       <div className={css.cards}>
    //         {col.cards.length ? (
    //           col.cards.map(card => (
    //             <div key={card._id} className={css.card}>
    //               {card.title}
    //             </div>
    //           ))
    //         ) : (
    //           <p>No cards</p>
    //         )}
    //       </div>
    //     </div>
    //   ))}
    // </div>
  );
};

export default ActiveBoard;
