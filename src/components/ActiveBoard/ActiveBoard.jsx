import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import request from '../../utils/axiosInstance';

// import css from './ActiveBoard.module.css';

const ActiveBoard = () => {
  const activeBoard = useSelector(state => state.boards.activeBoard);
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
    <div>{activeBoard?._id}</div>
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
