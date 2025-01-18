import React from "react";

export default function CreateEditEventModal({
  initialEventData,
  onClose,
  onSave,
  onDelete
}) {
  const [title, setTitle] = React.useState(initialEventData?.title || "");
  const [startDate, setStartDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [location, setLocation] = React.useState(initialEventData?.location || "");
  const [description, setDescription] = React.useState(initialEventData?.description || "");
  const [organizer, setOrganizer] = React.useState(initialEventData?.organizer || "");

  React.useEffect(() => {
    if (initialEventData) {
      // Pre-fill date/time fields
      // We expect initialEventData.start/end to be real Dates
      const s = initialEventData.start;
      const e = initialEventData.end;
      if (s instanceof Date && !isNaN(s)) {
        setStartDate(formatDate(s));
        setStartTime(formatTime(s));
      }
      if (e instanceof Date && !isNaN(e)) {
        setEndDate(formatDate(e));
        setEndTime(formatTime(e));
      }
    }
  }, [initialEventData]);

  function formatDate(d) {
    // yyyy-mm-dd
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
  }

  function formatTime(d) {
    // hh:mm 24-hour
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${min}`;
  }

  // build a real date object from the user input
  function parseDateTime(dateStr, timeStr) {
    if (!dateStr) return null;
    if (!timeStr) return new Date(dateStr); // fallback
    return new Date(`${dateStr}T${timeStr}`);
  }

  function handleSubmit() {
    const startObj = parseDateTime(startDate, startTime);
    const endObj = parseDateTime(endDate, endTime);
    const payload = {
      id: initialEventData?.id,
      title,
      start: startObj,
      end: endObj,
      location,
      description,
      organizer
    };
    onSave(payload);
  }

  function handleDelete() {
    if (initialEventData?.id) {
      onDelete(initialEventData.id);
    }
  }

  if (!initialEventData && !title && !startDate && !startTime && !endDate && !endTime) {
    // If no data and brand new event, that is normal. 
    // We'll show blank fields for creation. 
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>{initialEventData ? "Edit Event" : "New Event"}</h3>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.body}>
          <label style={styles.label}>Title</label>
          <input
            style={styles.input}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label style={styles.label}>Start Date & Time</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              style={styles.input}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              style={styles.input}
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <label style={styles.label}>End Date & Time</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              style={styles.input}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              style={styles.input}
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <label style={styles.label}>Location</label>
          <input
            style={styles.input}
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label style={styles.label}>Organizer</label>
          <input
            style={styles.input}
            type="text"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
          />
        </div>

        <div style={styles.footer}>
          <button style={styles.btn} onClick={handleSubmit}>
            {initialEventData ? "Update" : "Create"}
          </button>
          {initialEventData?.id && (
            <button style={styles.btnDelete} onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999
  },
  modal: {
    backgroundColor: "#2D2D2D",
    color: "#fff",
    padding: "1rem",
    width: "400px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem"
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer"
  },
  body: {
    marginBottom: "1rem"
  },
  label: {
    display: "block",
    marginTop: "0.5rem",
    marginBottom: "0.25rem",
    fontWeight: "bold"
  },
  input: {
    width: "100%",
    padding: "0.25rem",
    marginBottom: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #555",
    backgroundColor: "#3d3d3d",
    color: "#fff"
  },
  textarea: {
    width: "100%",
    height: "60px",
    padding: "0.25rem",
    borderRadius: "4px",
    border: "1px solid #555",
    backgroundColor: "#3d3d3d",
    color: "#fff",
    resize: "vertical"
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.5rem"
  },
  btn: {
    backgroundColor: "#0078d4",
    border: "none",
    color: "#fff",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    borderRadius: "4px"
  },
  btnDelete: {
    backgroundColor: "#d40000",
    border: "none",
    color: "#fff",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    borderRadius: "4px"
  }
};
