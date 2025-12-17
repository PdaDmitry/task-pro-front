import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import css from './FiltersModal.module.css';
import { useState } from 'react';

const FiltersModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector(state => state.auth.user);

  return <div className={css.contFilters}>Filters Modal</div>;
};

export default FiltersModal;
