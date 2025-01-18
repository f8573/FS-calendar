// src/App.js
import React from "react";
import axios from "axios";
import TopNav from "./components/TopNav";
import Sidebar from "./components/Sidebar";
import CalendarView from "./components/CalendarView";
import EventDetails from "./components/EventDetails";
import ViewEventPopup from "./components/ViewEventPopup";
import CreateEditEventModal from "./components/CreateEditEventModal";
import LoginModal from "./LoginModal";
import "./index.css";

export default function App() {
  const [monthIndex, setMonthIndex] = React.useState(0);
  const [year, setYear] = React.useState(2025);

  const [events, setEvents] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedEvent, setSelectedEvent] = React.useState(null);

  const [showCalendar, setShowCalendar] = React.useState(true);
  const [showEventDetails, setShowEventDetails] = React.useState(true);

  const [showViewPopup, setShowViewPopup] = React.useState(false);
  const [showCreateEditModal, setShowCreateEditModal] = React.useState(false);
  const [editEventData, setEditEventData] = React.useState(null);

  const [token, setToken] = React.useState("");
  const [loggedInUser, setLoggedInUser] = React.useState(null);
  const [showLoginModal, setShowLoginModal] = React.useState(false);

  React.useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setLoggedInUser(storedUser);
      fetchEvents(storedToken);
    }
  }, []);

  // Switch calendar on/off
  function toggleCalendar() {
    setShowCalendar(!showCalendar);
  }

  // Switch event details on/off
  function toggleEventDetails() {
    setShowEventDetails(!showEventDetails);
  }

  function nextMonth() {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear(y => y + 1);
    } else {
      setMonthIndex(m => m + 1);
    }
  }

  function prevMonth() {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear(y => y - 1);
    } else {
      setMonthIndex(m => m - 1);
    }
  }

  function goToToday() {
    const today = new Date();
    setYear(today.getFullYear());
    setMonthIndex(today.getMonth());
    setSelectedDate(today);
    setSelectedEvent(null);
  }

  // Launch "Create new event" modal
  function handleNewEvent() {
    setEditEventData(null);
    setShowCreateEditModal(true);
  }

  function handleViewEvent(eventItem) {
    setSelectedEvent(eventItem);
    setShowViewPopup(true);
  }

  function handleEditEvent(eventItem) {
    setEditEventData(eventItem);
    setShowViewPopup(false);
    setShowCreateEditModal(true);
  }

  // ----- 1) Re-fetch events from the server so we don't get duplicates or stale data -----
  async function fetchEvents(tkn) {
    try {
      const res = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${tkn}` },
      });
      // Convert server's _id to id, parse dates
      const converted = res.data.map(e => ({
        ...e,
        id: e._id,                       // rename _id -> id
        start: new Date(e.start),       // parse from string
        end: new Date(e.end),
      }));
      setEvents(converted);
    } catch (err) {
      console.error("Fetch events error:", err);
    }
  }

  // ----- 2) Save event (create or update), then re-fetch -----
  async function handleSaveEvent(updatedOrNewEvent) {
    try {
      // ensure date objects
      const payload = {
        ...updatedOrNewEvent,
        start: new Date(updatedOrNewEvent.start),
        end: new Date(updatedOrNewEvent.end),
      };

      if (payload.id) {
        // update existing event
        await axios.put(
          `http://localhost:5000/api/events/${payload.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // new event
        await axios.post("http://localhost:5000/api/events", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShowCreateEditModal(false);
      setEditEventData(null);

      // Re-fetch so we don't inadvertently duplicate or mismatch
      fetchEvents(token);

    } catch (err) {
      console.error("Save event error:", err);
    }
  }

  // ----- 3) Delete event by ID, then re-fetch -----
  async function handleDeleteEvent(eventId) {
    if (!eventId) {
      console.error("handleDeleteEvent called with undefined eventId");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowViewPopup(false);
      setShowCreateEditModal(false);
      setEditEventData(null);

      // re-fetch to get updated list
      fetchEvents(token);

    } catch (err) {
      console.error("Delete event error:", err);
    }
  }

  // Auth / Login
  async function handleLogin({ username, password }) {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password
      });
      const { token: newToken } = res.data;
      localStorage.setItem("token", newToken);
      localStorage.setItem("username", username);
      setToken(newToken);
      setLoggedInUser(username);
      setShowLoginModal(false);
      fetchEvents(newToken);
    } catch (err) {
      console.error("Login error:", err);
      alert("Login error or invalid credentials.");
    }
  }

  async function handleRegister({ username, password }) {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
      });
      alert("Registered successfully. Please log in.");
    } catch (err) {
      console.error("Register error:", err);
      alert("Registration error. Possibly username taken.");
    }
  }

  function handleOpenLogin() {
    setShowLoginModal(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setLoggedInUser(null);
    setEvents([]);
  }

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <TopNav
        onNewEvent={handleNewEvent}
        goToToday={goToToday}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        monthIndex={monthIndex}
        year={year}
        loggedInUser={loggedInUser}
        onLoginClick={handleOpenLogin}
        onLogout={handleLogout}
      />

      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar toggleCalendar={toggleCalendar} toggleEventDetails={toggleEventDetails} />
        {showCalendar && (
          <CalendarView
            year={year}
            monthIndex={monthIndex}
            events={events}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            onViewEvent={handleViewEvent}
            onEditEvent={handleEditEvent}
          />
        )}
        {showEventDetails && (
          <EventDetails
            events={events}
            selectedDate={selectedDate}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            onViewEvent={handleViewEvent}
          />
        )}
      </div>

      {showViewPopup && selectedEvent && (
        <ViewEventPopup
          eventItem={selectedEvent}
          onClose={() => setShowViewPopup(false)}
          onEdit={() => handleEditEvent(selectedEvent)}
          onDelete={() => handleDeleteEvent(selectedEvent.id)} 
          /* We use selectedEvent.id here, now that we've renamed _id -> id */
        />
      )}

      {showCreateEditModal && (
        <CreateEditEventModal
          initialEventData={editEventData}
          onClose={() => {
            setShowCreateEditModal(false);
            setEditEventData(null);
          }}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}
