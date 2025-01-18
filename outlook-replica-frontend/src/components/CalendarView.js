// src/components/CalendarView.js
import React from "react";
import "./CalendarView.css";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dayOnly(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function eventCoversDay(event, day) {
  const d = dayOnly(day);
  const startD = dayOnly(event.start);
  const endD = dayOnly(event.end);
  return d >= startD && d <= endD;
}

// Sort so multi-day events come first, then earliest start
function sortEvents(a, b) {
  const aMulti = !isSameDay(a.start, a.end);
  const bMulti = !isSameDay(b.start, b.end);
  if (aMulti && !bMulti) return -1;
  if (!aMulti && bMulti) return 1;
  return a.start - b.start;
}

export default function CalendarView({
  year,
  monthIndex,
  events,
  selectedDate,
  setSelectedDate,
  selectedEvent,
  setSelectedEvent,
  onViewEvent,
  onEditEvent
}) {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const offset = firstDayOfMonth.getDay();
  const startDate = new Date(
    firstDayOfMonth.getFullYear(),
    firstDayOfMonth.getMonth(),
    1 - offset
  );

  const totalCells = 42;
  const calendarDays = [];
  for (let i = 0; i < totalCells; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    calendarDays.push(d);
  }

  function handleDayClick(day) {
    setSelectedDate(day);
    setSelectedEvent(null);
  }

  function handleEventClick(e, eventItem) {
    e.stopPropagation();
    setSelectedEvent(eventItem);
    onViewEvent(eventItem);
  }

  function handleEventDoubleClick(eventItem) {
    onEditEvent(eventItem);
  }

  function renderWeekRow(rowIndex) {
    const rowDays = calendarDays.slice(rowIndex * 7, rowIndex * 7 + 7);

    return (
      <tr key={rowIndex}>
        {rowDays.map((day, cellIndex) => {
          const isCurrentMonth = day.getMonth() === monthIndex;
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          const cellEvents = events.filter((ev) => eventCoversDay(ev, day));
          cellEvents.sort(sortEvents);

          return (
            <td
              key={cellIndex}
              className={
                (isCurrentMonth ? "current-month" : "other-month") +
                (isSelected ? " selected-day" : "")
              }
              onClick={() => handleDayClick(day)}
            >
              <div className="day-number">{day.getDate()}</div>
              {cellEvents.map((ev) => {
                // If we have renamed _id -> id in App.js fetch, we have ev.id
                // So do key={ev.id}
                const isThisEventSelected = selectedEvent && ev.id === selectedEvent.id;
                return (
                  <div
                    key={ev.id}
                    className={
                      "event-badge" + (isThisEventSelected ? " selected-event" : "")
                    }
                    onClick={(evt) => handleEventClick(evt, ev)}
                    onDoubleClick={() => handleEventDoubleClick(ev)}
                  >
                    {ev.title}
                  </div>
                );
              })}
            </td>
          );
        })}
      </tr>
    );
  }

  return (
    <div className="calendar-container">
      <table className="calendar-table">
        <thead>
          <tr>
            {daysOfWeek.map((dow) => (
              <th key={dow}>{dow}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, weekIndex) => renderWeekRow(weekIndex))}
        </tbody>
      </table>
    </div>
  );
}
