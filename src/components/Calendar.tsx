import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  format,
  isSameMonth,
  isSameDay,
} from 'date-fns';

interface CalendarProps {
  onDateMark: (date: Date) => void; // só data, motivo sai daqui
}

const Calendar: React.FC<CalendarProps> = ({ onDateMark }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const handleDayClick = (day: Date) => {
    onDateMark(day);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
      <button onClick={prevMonth} className="p-1 hover:bg-gray-300 rounded">←</button>
      <h2 className="text-lg font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
      <button onClick={nextMonth} className="p-1 hover:bg-gray-300 rounded">→</button>
    </div>
  );

  const renderDays = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return (
      <div className="grid grid-cols-7 text-center font-medium mt-2">
        {days.map((day) => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows: React.ReactElement[] = [];
    let days: React.ReactElement[] = [];
    let day = startDate;
    const today = new Date();

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        days.push(
          <div
            key={cloneDay.toISOString()}
            className={[
              'p-2 border hover:bg-blue-100 cursor-pointer text-center rounded',
              !isSameMonth(cloneDay, monthStart) ? 'text-gray-400' : 'text-gray-800',
              isSameDay(cloneDay, today) ? 'bg-emerald-200 text-emerald-800 font-bold' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => handleDayClick(cloneDay)}
          >
            {format(cloneDay, 'd')}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toISOString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  const nextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(prev => addMonths(prev, -1));
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow p-4 rounded">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
