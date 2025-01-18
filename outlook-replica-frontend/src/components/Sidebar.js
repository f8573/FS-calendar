// Sidebar.js (modified)
import React from "react";

export default function Sidebar({ toggleCalendar, toggleEventDetails }) {
  // Removed the "Add event" fields

  return (
    <div
      style={{
        width: "200px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #ddd",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <div>
        <h3 style={{ marginBottom: "1rem" }}>Sidebar</h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li
            style={{ margin: "0.5rem 0", cursor: "pointer" }}
            onClick={toggleCalendar}
          >
            Calendar
          </li>
          <li
            style={{ margin: "0.5rem 0", cursor: "pointer" }}
            onClick={toggleEventDetails}
          >
            Tasks
          </li>
        </ul>
      </div>
    </div>
  );
}
