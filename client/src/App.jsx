import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  // -----------------------------
  // TASK STATE
  // -----------------------------

  const [tasks, setTasks] = useState([]);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [newTask, setNewTask] = useState({
    title: "",
    subject: "",
    dueDate: "",
    priority: "Medium"
  });

  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState(null);

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const user = {
    name: "Student",
    email: "student@example.com"
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());

const [newEvent, setNewEvent] = useState({
    title: "",
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    type: "Lecture"
});


  useEffect(() => {
  fetchTasks();
  fetchEvents();
}, []);

const fetchTasks = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/tasks"
    );

    setTasks(response.data);

  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  }
};

const fetchEvents = async () => {
    try {
        const response = await axios.get(
            "http://localhost:5000/api/events"
        );

        setEvents(response.data);

    } catch (error) {

        console.error("Failed to fetch events:", error);

    }
};


  // -----------------------------
  // ADD TASK
  // -----------------------------

const handleAddTask = async (e) => {
  e.preventDefault();

  if (!newTask.title.trim() || !newTask.dueDate) {
    alert("Please enter a task title and due date.");
    return;
  }

  try {
    if (editingTaskId) {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${editingTaskId}`,
        newTask
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === editingTaskId ? response.data : task
        )
      );
    } else {
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        newTask
      );

      setTasks((currentTasks) => [
        ...currentTasks,
        response.data
      ]);
    }

    setNewTask({
      title: "",
      subject: "",
      dueDate: "",
      priority: "Medium"
    });
    setEditingTaskId(null);
    setShowTaskForm(false);
  } catch (error) {
    console.error("Failed to save task:", error);
    alert(
      error.response?.data?.message ||
      "Failed to save task. Please check the details and try again."
    );
  }
};

const handleEditTask = (task) => {
  setEditingTaskId(task._id);
  setNewTask({
    title: task.title || "",
    subject: task.subject || "",
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    priority: task.priority || "Medium"
  });
  setShowTaskForm(true);
};

const closeTaskForm = () => {
  setShowTaskForm(false);
  setEditingTaskId(null);
  setNewTask({
    title: "",
    subject: "",
    dueDate: "",
    priority: "Medium"
  });
};

const emptyEvent = {
    title: "",
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    type: "Lecture"
};

const openNewEventForm = () => {
    setEditingEventId(null);
    setNewEvent({ ...emptyEvent });
    setShowEventForm(true);
};

const handleEditEvent = (event) => {
    setEditingEventId(event._id);
    setNewEvent({
        title: event.title || "",
        subject: event.subject || "",
        date: event.date ? event.date.slice(0, 10) : "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        location: event.location || "",
        type: event.type || "Other"
    });
    setShowEventForm(true);
};

const closeEventForm = () => {
    setShowEventForm(false);
    setEditingEventId(null);
    setNewEvent({ ...emptyEvent });
};

const handleAddEvent = async (e) => {
    e.preventDefault();

    if (
        !newEvent.title.trim() ||
        !newEvent.date ||
        !newEvent.startTime ||
        !newEvent.endTime
    ) {
        alert("Please enter a title, date, start time and end time.");
        return;
    }

    if (newEvent.endTime <= newEvent.startTime) {
        alert("The end time must be later than the start time.");
        return;
    }

    try {
        if (editingEventId) {
            const response = await axios.put(
                `http://localhost:5000/api/events/${editingEventId}`,
                newEvent
            );

            setEvents((currentEvents) =>
                currentEvents.map((event) =>
                    event._id === editingEventId ? response.data : event
                )
            );
            setSelectedDate(newEvent.date);
        } else {
            const response = await axios.post(
                "http://localhost:5000/api/events",
                newEvent
            );

            setEvents((currentEvents) => [
                ...currentEvents,
                response.data
            ]);
            setSelectedDate(newEvent.date);
        }

        closeEventForm();
    } catch (error) {
        console.error("Failed to save event:", error);
        alert(
            error.response?.data?.message ||
            "Failed to save event. Please check the details and try again."
        );
    }
};

const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) {
        return;
    }

    try {
        await axios.delete(`http://localhost:5000/api/events/${eventId}`);
        setEvents((currentEvents) =>
            currentEvents.filter((event) => event._id !== eventId)
        );
    } catch (error) {
        console.error("Failed to delete event:", error);
        alert(error.response?.data?.message || "Failed to delete event.");
    }
};

// -----------------------------
// CALENDAR HELPERS
// -----------------------------

const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
};

const formatTime = (time) => {
    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });
};

const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    // Empty cells before the first day
    for (let i = 0; i < firstDay.getDay(); i++) {
        days.push(null);
    }

    // Actual days
    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(new Date(year, month, day));
    }

    return days;
};

const getEventsForDate = (date) => {
    if (!date) {
        return [];
    }

    const dateKey = formatDateKey(date);

    return events.filter(
        (event) => event.date.slice(0, 10) === dateKey
    );
};

const goToPreviousMonth = () => {
    setCurrentMonth(
        new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() - 1,
            1
        )
    );
};

const goToNextMonth = () => {
    setCurrentMonth(
        new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            1
        )
    );
};

const goToToday = () => {
    const today = new Date();

    setCurrentMonth(
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        )
    );

    setSelectedDate(formatDateKey(today));
};
  // -----------------------------
  // DELETE TASK
  // -----------------------------

 const handleDeleteTask = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/tasks/${id}`
    );

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task._id !== id)
    );

  } catch (error) {
    console.error("Failed to delete task:", error);
  }
};


// -----------------------------
// MARK TASK COMPLETE
// -----------------------------

const handleCompleteTask = async (id, completed) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/tasks/${id}`,
      {
        completed: !completed
      }
    );

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === id ? response.data : task
      )
    );
  } catch (error) {
    console.error("Failed to update task:", error);
    alert("Failed to update task.");
  }
};

  return (
    <div className="app">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">S</div>
          <span>StudyFlow</span>
        </div>


        <nav className="navigation">

          <button
    className={`nav-item ${
        currentView === "dashboard" ? "active" : ""
    }`}
    onClick={() => setCurrentView("dashboard")}
>
    <span>🏠</span>
    Dashboard
    </button>

          <button
          className={`nav-item ${
              currentView === "calendar" ? "active" : ""
          }`}
          onClick={() => setCurrentView("calendar")}
      >
          <span>📅</span>
          Calendar
      </button>

    </nav>


        <div className="sidebar-bottom">

          <a href="#" className="nav-item">
            <span>⚙️</span>
            Settings
          </a>

        </div>

      </aside>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="main-content">

    {currentView === "dashboard" ? (
        <>
        
        {/* HEADER */}

        <header className="header">

          <div>

            <h1>
              Good morning, Student! 👋
            </h1>

            <p>
              Here's what's happening with your studies today.
            </p>

          </div>


          <div className="profile">

    <button
        className="avatar"
        onClick={() =>
            setShowAccountMenu(!showAccountMenu)
        }
    >
        {user.name.charAt(0).toUpperCase()}
    </button>

    {showAccountMenu && (

        <div className="account-menu">

            <div className="account-info">

                <div className="account-avatar">
                    {user.name.charAt(0).toUpperCase()}
                </div>

                <div>

                    <strong>
                        {user.name}
                    </strong>

                    <span>
                        {user.email}
                    </span>

                </div>

            </div>


            <div className="account-divider"></div>


            <button
                className="logout-button"
                onClick={() => {
                    setShowAccountMenu(false);
                    alert("Logged out.");
                }}
            >
                🚪 Log out
            </button>

        </div>

    )}

</div>

        </header>


{/* =========================
    URGENT & UPCOMING
========================= */}

<section className="section">

    <div className="section-title">

        <h2>
            Urgent & Upcoming
        </h2>

    </div>

    <div className="urgent-container">

        {tasks
            .filter((task) => !task.completed)
            .sort(
                (a, b) =>
                    new Date(a.dueDate) -
                    new Date(b.dueDate)
            )
            .slice(0, 3)
            .map((task) => {

                const today = new Date();
                const dueDate = new Date(task.dueDate);

                const difference =
                    Math.ceil(
                        (dueDate - today) /
                        (1000 * 60 * 60 * 24)
                    );

                let dueText;

                if (difference < 0) {
                    dueText = "Overdue";
                } else if (difference === 0) {
                    dueText = "Due today";
                } else if (difference === 1) {
                    dueText = "Due tomorrow";
                } else {
                    dueText = `Due in ${difference} days`;
                }

                return (
                    <div
                        className={`urgent-card ${
                            difference <= 1
                                ? "urgent"
                                : "upcoming"
                        }`}
                        key={task._id}
                    >

                        <div className="card-icon">
                            {difference <= 1 ? "⚠️" : "📅"}
                        </div>

                        <div>

                            <span className="card-label">
                                {difference <= 1
                                    ? "URGENT"
                                    : "UPCOMING"}
                            </span>

                            <h3>
                                {task.title}
                            </h3>

                            <p>
                                {dueText}
                            </p>

                        </div>

                    </div>
                );
            })}

        {tasks.filter((task) => !task.completed).length === 0 && (

            <div className="empty-task">
                No upcoming tasks.
            </div>

        )}

    </div>

</section>


        {/* =========================
            TASKS
        ========================= */}

        <section className="section">

          <div className="section-title">

            <h2>
              My Tasks
            </h2>

            <span className="task-count">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </span>

          </div>


          <div className="task-list">

            {tasks.length === 0 ? (

              <div className="empty-task">
                No tasks yet. Add your first task!
              </div>

            ) : (

              tasks.map((task) => (

                <div
                  className={`task-item ${
                    task.completed ? "task-completed" : ""
                  }`}
                  key={task._id}
                >

                  <button
                    className="complete-button"
                    onClick={() =>
                      handleCompleteTask(task._id, task.completed)
                    }
                  >
                    {task.completed ? "✓" : ""}
                  </button>


                  <div className="task-details">

                    <h3>
                      {task.title}
                    </h3>

                    <p>
                      {task.subject || "No subject"} • Due{" "}
                      {task.dueDate}
                    </p>

                  </div>


                  <span
                    className={`priority ${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>


                  <button
                    type="button"
                    className="edit-task"
                    title="Edit task"
                    aria-label={`Edit ${task.title}`}
                    onClick={() => handleEditTask(task)}
                  >
                    ✏️
                  </button>

                  <button
                    className="delete-task"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    🗑️
                  </button>

                </div>

              ))

            )}

          </div>

        </section>


{/* =========================
    TODAY'S SCHEDULE
========================= */}

<section className="section">

    <div className="section-title">

        <h2>
            Today's Schedule
        </h2>

        <button
            className="view-all"
            onClick={() => setCurrentView("calendar")}
        >
            View calendar →
        </button>

    </div>

    <div className="schedule-card">

        {events
            .filter((event) => {
                const today = new Date();
                const todayKey = formatDateKey(today);

                return event.date.slice(0, 10) === todayKey;
            })
            .sort(
                (a, b) =>
                    a.startTime.localeCompare(b.startTime)
            )
            .map((event) => (

                <div
                    className="schedule-item"
                    key={event._id}
                >

                    <div className="time">

                        {formatTime(event.startTime)}

                    </div>

                    <div className="schedule-line"></div>

                    <div className="schedule-info">

                        <h3>
                            {event.title}
                        </h3>

                        <p>
                            {event.type}
                            {event.location
                                ? ` • ${event.location}`
                                : ""}
                        </p>

                    </div>

                </div>

            ))}

        {events.filter((event) => {
            const today = new Date();
            const todayKey = formatDateKey(today);

            return event.date.slice(0, 10) === todayKey;
        }).length === 0 && (

            <div className="empty-task">
                No events scheduled for today.
            </div>

        )}

    </div>

</section>


        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <section className="section">

          <div className="section-title">

            <h2>
              Quick Actions
            </h2>

          </div>


          <div className="quick-actions">


            {/* ADD TASK */}

            <button
              className="action-card"
              onClick={() => setShowTaskForm(true)}
            >

              <div className="action-icon">
                ✓
              </div>

              <div>

                <h3>
                  Add Task
                </h3>

                <p>
                  Create a new study task
                </p>

              </div>

            </button>


            {/* ADD EVENT */}

            <button className="action-card"
            onClick={openNewEventForm}
            >

              <div className="action-icon">
                📅
              </div>

              <div>

                <h3>
                  Add Event
                </h3>

                <p>
                  Schedule a class or event
                </p>

              </div>

            </button>

          </div>

                </section>

        </>


    ) : (

        <section className="section calendar-section">

          <div className="section-title">

              <div>
                  <h2>Calendar</h2>

                  <p>
                      Your schedule and upcoming events
                  </p>
              </div>

          </div>


    <div className="calendar-card">

        {/* CALENDAR HEADER */}

        <div className="calendar-header">

            <button
                className="calendar-nav-button"
                onClick={goToPreviousMonth}
            >
                ←
            </button>

            <h2>
                {currentMonth.toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        year: "numeric"
                    }
                )}
            </h2>

            <button
                className="calendar-nav-button"
                onClick={goToNextMonth}
            >
                →
            </button>

        </div>


        <button
            className="calendar-today-button"
            onClick={goToToday}
        >
            Today
        </button>


        {/* WEEK DAYS */}

        <div className="calendar-weekdays">

            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>

        </div>


        {/* CALENDAR DAYS */}

        <div className="calendar-grid">

            {getCalendarDays().map((date, index) => {

                if (!date) {
                    return (
                        <div
                            className="calendar-day empty"
                            key={`empty-${index}`}
                        ></div>
                    );
                }

                const dateKey = formatDateKey(date);

                const dayEvents =
                    getEventsForDate(date);

                const todayKey =
                    formatDateKey(new Date());

                const isToday =
                    dateKey === todayKey;

                const isSelected =
                    selectedDate === dateKey;

                return (

                    <button
                        className={`calendar-day ${
                            isToday ? "today" : ""
                        } ${
                            isSelected ? "selected" : ""
                        }`}
                        key={dateKey}
                        onClick={() =>
                            setSelectedDate(dateKey)
                        }
                    >

                        <span className="calendar-day-number">
                            {date.getDate()}
                        </span>


                        <div className="calendar-day-events">

                            {dayEvents.map((event) => (

                                <div
                                    className="calendar-event-title"
                                    key={event._id}
                                >
                                    {event.title}
                                </div>

                            ))}

                        </div>

                    </button>

                );
            })}

        </div>


        {/* SELECTED DATE DETAILS */}

        {selectedDate && (

            <div className="event-details">

                <div className="event-details-header">

                    <h3>
                        {formatDisplayDate(selectedDate)}
                    </h3>

                    <button
                        onClick={() =>
                            setSelectedDate(null)
                        }
                    >
                        Close
                    </button>

                </div>


                {events.filter(
                    (event) =>
                        event.date.slice(0, 10) ===
                        selectedDate
                ).length === 0 ? (

                    <p>
                        No events scheduled for this date.
                    </p>

                ) : (

                    events
                        .filter(
                            (event) =>
                                event.date.slice(0, 10) ===
                                selectedDate
                        )
                        .sort(
                            (a, b) =>
                                a.startTime.localeCompare(
                                    b.startTime
                                )
                        )
                        .map((event) => (

                            <div
                                className="event-detail-card"
                                key={event._id}
                            >

                                <h3>
                                    {event.title}
                                </h3>

                                <p>
                                    <strong>
                                        Subject:
                                    </strong>{" "}
                                    {event.subject ||
                                        "Not specified"}
                                </p>

                                <p>
                                    <strong>
                                        Time:
                                    </strong>{" "}
                                    {formatTime(
                                        event.startTime
                                    )}
                                    {" - "}
                                    {formatTime(
                                        event.endTime
                                    )}
                                </p>

                                <p>
                                    <strong>
                                        Location:
                                    </strong>{" "}
                                    {event.location ||
                                        "Not specified"}
                                </p>

                                <p>
                                    <strong>
                                        Type:
                                    </strong>{" "}
                                    {event.type}
                                </p>

                                <div className="event-card-actions">
                                    <button
                                        type="button"
                                        className="edit-event-button"
                                        onClick={() => handleEditEvent(event)}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="delete-event-button"
                                        onClick={() => handleDeleteEvent(event._id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>

                            </div>

                        ))

                )}

            </div>

        )}

    </div>

</section>


    )}

      </main>

      {/* =========================
          ADD TASK MODAL
      ========================= */}

      {showTaskForm && (

        <div
          className="modal-overlay"
          onClick={closeTaskForm}
        >

          <div
            className="task-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>

                <h2>
                  {editingTaskId ? "Edit Task" : "Add New Task"}
                </h2>

                <p>
                  {editingTaskId
                    ? "Update the details of this task."
                    : "Create a task for your study plan."}
                </p>

              </div>

              <button
                className="close-button"
                onClick={closeTaskForm}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleAddTask}>


              {/* TASK TITLE */}

              <div className="form-group">

                <label>
                  Task Title *
                </label>

                <input
                  type="text"
                  placeholder="e.g. Complete DSA assignment"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      title: e.target.value
                    })
                  }
                />

              </div>


              {/* SUBJECT */}

              <div className="form-group">

                <label>
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="e.g. Data Structures"
                  value={newTask.subject}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      subject: e.target.value
                    })
                  }
                />

              </div>


              {/* DUE DATE */}

              <div className="form-group">

                <label>
                  Due Date *
                </label>

                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      dueDate: e.target.value
                    })
                  }
                />

              </div>


              {/* PRIORITY */}

              <div className="form-group">

                <label>
                  Priority
                </label>

                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      priority: e.target.value
                    })
                  }
                >

                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                </select>

              </div>


              {/* BUTTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeTaskForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  {editingTaskId ? "Save Changes" : "Add Task"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {showEventForm && (
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


            <form onSubmit={handleAddEvent}>

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
                            setShowEventForm(false)
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
)}

    </div>
  );
}

export default App;