import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import css from './FiltersModal.module.css';
import { useState } from 'react';

const FiltersModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector(state => state.auth.user);

  return (
    <div
      className={css.contFilters}
      style={{
        border: currentUser?.theme === 'Dark' ? ' 1px solid  #9dc888' : '',
      }}
    >
      <svg className={css.closeBtnSvg} onClick={closeModal}>
        <use href="/symbol-defs.svg#icon-x-close-1"></use>
      </svg>
      <h2 className={css.title}>Filters</h2>
    </div>
  );
};

export default FiltersModal;
