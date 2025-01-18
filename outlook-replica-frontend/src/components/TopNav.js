import React from "react";

export default function TopNav({
  onNewEvent,
  goToToday,
  prevMonth,
  nextMonth,
  monthIndex,
  year,
  loggedInUser,
  onLoginClick,
  onLogout
}) {
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  return (
    <div
      style={{
        height: "50px",
        backgroundColor: "#0078d4",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        padding: "0 1rem",
        justifyContent: "space-between"
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          style={{
            backgroundColor: "#006bb3",
            border: "none",
            color: "#fff",
            padding: "0.5rem 1rem",
            marginRight: "1rem",
            cursor: "pointer"
          }}
          onClick={onNewEvent}
        >
          New event
        </button>

        <button
          style={{
            backgroundColor: "#006bb3",
            border: "none",
            color: "#fff",
            padding: "0.5rem 1rem",
            marginRight: "0.5rem",
            cursor: "pointer"
          }}
          onClick={goToToday}
        >
          Today
        </button>

        <button
          style={{
            backgroundColor: "#006bb3",
            border: "none",
            color: "#fff",
            padding: "0.5rem 1rem",
            marginRight: "0.5rem",
            cursor: "pointer"
          }}
          onClick={prevMonth}
        >
          &lt;
        </button>

        <button
          style={{
            backgroundColor: "#006bb3",
            border: "none",
            color: "#fff",
            padding: "0.5rem 1rem",
            marginRight: "1rem",
            cursor: "pointer"
          }}
          onClick={nextMonth}
        >
          &gt;
        </button>

        <div style={{ fontWeight: "bold" }}>
          {monthNames[monthIndex]} {year}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        {loggedInUser ? (
          <>
            <span style={{ marginRight: "1rem" }}>Hello, {loggedInUser}</span>
            <button
              style={{
                backgroundColor: "#d40000",
                border: "none",
                color: "#fff",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                borderRadius: "4px"
              }}
              onClick={onLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            style={{
              backgroundColor: "#006bb3",
              border: "none",
              color: "#fff",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              borderRadius: "4px"
            }}
            onClick={onLoginClick}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}
