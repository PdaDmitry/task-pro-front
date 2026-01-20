import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import css from './FiltersModal.module.css';
import { useState } from 'react';
import { PRIORITY_COLORS } from '../../../utils/constants';
import { MdOutlineRadioButtonChecked, MdCircle } from 'react-icons/md';

const FiltersModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedPriority, setSelectedPriority] = useState('all');

  const currentUser = useSelector(state => state.auth.user);

  const handlePriorityChange = value => {
    setSelectedPriority(value);

    // dispatch(setFilterPriority(value === 'all' ? null : value));
  };

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
      <div className={css.contTitleFilters}>
        <p className={css.textLable}>Label color</p>
        <p className={css.titleShowAll}>Show all</p>
      </div>

      {/* Вертикальные радиокнопки — только приоритеты */}
      <div className={css.priorityFilterSection}>
        <ul className={css.priorityList}>
          {PRIORITY_COLORS.map(item => {
            const isDarkTheme = currentUser?.theme === 'Dark';
            const fillColor = isDarkTheme && item.darkValue ? item.darkValue : item.value;

            const displayLabel = item.label === 'Without' ? 'Without priority' : item.label;

            return (
              <li key={item.value} className={css.priorityItem}>
                <input
                  type="radio"
                  id={`priority-${item.label.toLowerCase()}`}
                  name="priority"
                  value={item.label.toLowerCase()}
                  checked={selectedPriority === item.label.toLowerCase()}
                  onChange={() => handlePriorityChange(item.label.toLowerCase())}
                  className={css.radioInputHidden}
                />
                <label
                  htmlFor={`priority-${item.label.toLowerCase()}`}
                  className={css.priorityLabel}
                >
                  <div className={css.radioIcon}>
                    {selectedPriority === item.label.toLowerCase() ? (
                      <MdOutlineRadioButtonChecked style={{ fill: fillColor }} size={20} />
                    ) : (
                      <MdCircle style={{ fill: fillColor }} size={20} />
                    )}
                  </div>
                  <span>{displayLabel}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FiltersModal;
