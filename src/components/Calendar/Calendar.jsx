import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import { forwardRef, useState } from 'react';
import { useSelector } from 'react-redux';

import './Calendar.css';

const Calendar = ({ formData, setFormData, setShowCalendar }) => {
  const currentUser = useSelector(state => state.auth.user);

  const [startDate, setStartDate] = useState(new Date());

  const handleDateSelect = date => {
    if (!date) return;
    setStartDate(date);

    // const formatted = dayjs(date).format('DD/MM/YYYY');
    const formatted = dayjs(date).format('YYYY-MM-DD');
    setFormData(prev => ({ ...prev, deadline: formatted }));

    setShowCalendar(false);
  };

  const CalendarIconInput = forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      className="openCalendarBtn"
      onClick={onClick}
      ref={ref}
      aria-label="Open calendar"
    >
      <svg className="openCalendarSvg">
        <use
          href={
            currentUser?.theme === 'Violet'
              ? '/symbol-defs.svg#icon-chevron-down-4'
              : '/symbol-defs.svg#icon-chevron-down-3'
          }
        />
      </svg>
    </button>
  ));

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={handleDateSelect}
        customInput={<CalendarIconInput />}
        calendarStartDay={1}
        minDate={Date.now()}
      />
    </div>
  );
};

export default Calendar;
