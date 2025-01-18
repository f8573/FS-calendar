// EventDetails.js (modified)
import React from "react";

export default function EventDetails({
  events,
  selectedDate,
  selectedEvent,
  setSelectedEvent,
  onViewEvent
}) {
  if (!selectedDate) {
    return (
      <div
        style={{
          width: "250px",
          borderLeft: "1px solid #ddd",
          backgroundColor: "#2D2D2D",
          color: "#fff",
          padding: "1rem"
        }}
      >
        <h3>No Date Selected</h3>
        <p>Select a date to see the events.</p>
      </div>
    );
  }

  function dayOnly(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function eventSpansDay(event, testDay) {
    const start = dayOnly(event.start);
    const end = dayOnly(event.end);
    const check = dayOnly(testDay);
    return check >= start && check <= end;
  }

  const dayEvents = events.filter((ev) => eventSpansDay(ev, selectedDate));
  dayEvents.sort((a, b) => a.start - b.start);

  // Format date/time with full day/month/year if crossing days
  function formatTimeRange(ev) {
    const sameDay =
      ev.start.getFullYear() === ev.end.getFullYear() &&
      ev.start.getMonth() === ev.end.getMonth() &&
      ev.start.getDate() === ev.end.getDate();

    const dateOptsFull = {
      weekday: "short",
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric"
    };
    const timeOpts = { hour: "numeric", minute: "numeric" };

    if (sameDay) {
      const startStr = ev.start.toLocaleTimeString("en-US", timeOpts);
      const endStr = ev.end.toLocaleTimeString("en-US", timeOpts);
      return `${startStr} - ${endStr}`;
    } else {
      // Multi-day range
      const startStr = ev.start.toLocaleString("en-US", dateOptsFull);
      const endStr = ev.end.toLocaleString("en-US", dateOptsFull);
      return `${startStr} - ${endStr}`;
    }
  }

  return (
    <div
      style={{
        width: "250px",
        borderLeft: "1px solid #ddd",
        backgroundColor: "#2D2D2D",
        color: "#fff",
        padding: "1rem"
      }}
    >
      <h3>
        {selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        })}
      </h3>
      {dayEvents.length === 0 && <p>No events on this date.</p>}
      {dayEvents.map((ev) => {
        const isThisEventSelected = selectedEvent && ev.id === selectedEvent.id;
        const rangeStr = formatTimeRange(ev);

        return (
          <button
            key={ev.id}
            style={{
              width: "100%",
              textAlign: "left",
              backgroundColor: isThisEventSelected ? "#444" : "#333",
              border: "none",
              marginTop: "0.5rem",
              padding: "0.5rem",
              color: "#fff",
              cursor: "pointer",
              display: "block"
            }}
            onMouseEnter={(e) => {
              if (!isThisEventSelected) {
                e.currentTarget.style.backgroundColor = "#444";
              }
            }}
            onMouseLeave={(e) => {
              if (!isThisEventSelected) {
                e.currentTarget.style.backgroundColor = "#333";
              }
            }}
            onClick={() => {
              setSelectedEvent(ev);
              onViewEvent(ev);
            }}
          >
            <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
              {rangeStr}
            </div>
            <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
              {ev.title}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#ccc" }}>
              {ev.location}
            </div>
          </button>
        );
      })}
    </div>
  );
}
