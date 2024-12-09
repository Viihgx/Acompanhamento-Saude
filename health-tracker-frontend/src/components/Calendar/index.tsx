import React, { useState } from "react";
import "./CustomCalendar.css";

interface Event {
  date: Date;
  title: string;
}

interface CustomCalendarProps {
  events: Event[];
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ events }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const isEventDay = (date: Date) => {
    return events.some(
      (event) =>
        event.date.toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date();

  // Gerar dias para o calendário
  const generateDays = () => {
    const endDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const days = [];
    for (let i = 1; i <= endDay.getDate(); i++) {
      days.push(new Date(today.getFullYear(), today.getMonth(), i));
    }
    return days;
  };

  const days = generateDays();

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <h3>
          {today.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
      </header>
      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <div
            key={day.toDateString()}
            className={`calendar-day ${
              isEventDay(day) ? "event-day" : ""
            } ${selectedDate?.toDateString() === day.toDateString() ? "selected-day" : ""}`}
            onClick={() => handleDateClick(day)}
          >
            {day.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;
