// src/components/ViewEventPopup.js
import React from "react";

export default function ViewEventPopup({ eventItem, onClose, onEdit, onDelete }) {
  if (!eventItem) return null;

  function formatRange(ev) {
    // for multi-day formatting
    return `${ev.start.toLocaleString()} - ${ev.end.toLocaleString()}`;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>{eventItem.title}</h3>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <div style={styles.body}>
          <div><strong>{formatRange(eventItem)}</strong></div>
          <div>{eventItem.location}</div>
          <div style={{ marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>
            {eventItem.description}
          </div>
        </div>
        <div style={styles.footer}>
          <button style={styles.btn} onClick={onEdit}>Edit</button>
          <button style={styles.btnDelete} onClick={onDelete}>Delete</button>
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
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  popup: {
    backgroundColor: "#2D2D2D",
    color: "#fff",
    padding: "1rem",
    width: "350px",
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
  footer: {
    display: "flex",
    justifyContent: "flex-start",
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
