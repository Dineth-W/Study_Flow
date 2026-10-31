function EventForm({ showEventForm, newEvent, setNewEvent, editingEventId, onSubmit, onClose }) {
  const handleSubmit = onSubmit;
  const closeEventForm = onClose;
  return (
      showEventForm ? (
    <div className="modal-overlay">

        <div className="task-modal">

            <div className="modal-header">

                <div>
                    <h2>{editingEventId ? "Edit Event" : "Add Event"}</h2>
                    <p>{editingEventId ? "Update the event details" : "Create a new schedule event"}</p>
                </div>

                <button
                    type="button"
                    className="close-button"
                    onClick={closeEventForm}
                >
                    ×
                </button>

            </div>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Event Title</label>

                    <input
                        type="text"
                        placeholder="e.g. Data Structures Lecture"
                        value={newEvent.title}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                title: e.target.value
                            })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Subject / Category</label>

                    <input
                        type="text"
                        placeholder="e.g. Data Structures"
                        value={newEvent.subject}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                subject: e.target.value
                            })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Date</label>

                    <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                date: e.target.value
                            })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Start Time</label>

                    <input
                        type="time"
                        value={newEvent.startTime}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                startTime: e.target.value
                            })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>End Time</label>

                    <input
                        type="time"
                        value={newEvent.endTime}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                endTime: e.target.value
                            })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Location</label>

                    <input
                        type="text"
                        placeholder="e.g. Engineering Faculty"
                        value={newEvent.location}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                location: e.target.value
                            })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Event Type</label>

                    <select
                        value={newEvent.type}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                type: e.target.value
                            })
                        }
                    >
                        <option value="Lecture">
                            Lecture
                        </option>

                        <option value="Study Session">
                            Study Session
                        </option>

                        <option value="Lab">
                            Lab
                        </option>

                        <option value="Meeting">
                            Meeting
                        </option>

                        <option value="Other">
                            Other
                        </option>
                    </select>
                </div>

                <div className="modal-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                            closeEventForm()
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="save-button"
                    >
                        {editingEventId ? "Save Changes" : "Add Event"}
                    </button>

                </div>

            </form>

        </div>

    </div>
      ) : null
  );
}

export default EventForm;
