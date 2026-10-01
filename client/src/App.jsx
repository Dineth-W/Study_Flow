import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  // -----------------------------
  // TASK STATE
  // -----------------------------

  const [tasks, setTasks] = useState([]);

  const [showTaskForm, setShowTaskForm] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    subject: "",
    dueDate: "",
    priority: "Medium"
  });

  const [events, setEvents] = useState([]);
const [showEventForm, setShowEventForm] = useState(false);

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

  if (!newTask.title || !newTask.dueDate) {
    alert("Please enter a task title and due date.");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/tasks",
      newTask
    );

    setTasks((currentTasks) => [
      ...currentTasks,
      response.data
    ]);

    setNewTask({
      title: "",
      subject: "",
      dueDate: "",
      priority: "Medium"
    });

    setShowTaskForm(false);

  } catch (error) {
    console.error("Failed to create task:", error);
    alert("Failed to save task.");
  }
};

const handleAddEvent = async (e) => {
    e.preventDefault();

    if (
        !newEvent.title ||
        !newEvent.date ||
        !newEvent.startTime ||
        !newEvent.endTime
    ) {
        alert(
            "Please enter a title, date, start time and end time."
        );
        return;
    }

    try {

        const response = await axios.post(
            "http://localhost:5000/api/events",
            newEvent
        );

        setEvents((currentEvents) => [
            ...currentEvents,
            response.data
        ]);

        setNewEvent({
            title: "",
            subject: "",
            date: "",
            startTime: "",
            endTime: "",
            location: "",
            type: "Lecture"
        });

        setShowEventForm(false);

    } catch (error) {

        console.error(
            "Failed to create event:",
            error
        );

        alert("Failed to save event.");

    }
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

          <a href="#" className="nav-item active">
            <span>🏠</span>
            Dashboard
          </a>

          <a href="#" className="nav-item">
            <span>📅</span>
            Calendar
          </a>

          <a href="#" className="nav-item">
            <span>📊</span>
            Assessments
          </a>

          <a href="#" className="nav-item">
            <span>📚</span>
            Resources
          </a>

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

            <div className="notification">
              🔔
            </div>

            <div className="avatar">
              S
            </div>

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

            <button className="view-all">
              View all
            </button>

          </div>


          <div className="urgent-container">

            <div className="urgent-card urgent">

              <div className="card-icon">
                ⚠️
              </div>

              <div>

                <span className="card-label">
                  URGENT
                </span>

                <h3>
                  DSA Assignment
                </h3>

                <p>
                  Due tomorrow
                </p>

              </div>

            </div>


            <div className="urgent-card upcoming">

              <div className="card-icon">
                📅
              </div>

              <div>

                <span className="card-label">
                  UPCOMING
                </span>

                <h3>
                  Signals & Systems Exam
                </h3>

                <p>
                  In 5 days
                </p>

              </div>

            </div>


            <div className="urgent-card upcoming">

              <div className="card-icon">
                📝
              </div>

              <div>

                <span className="card-label">
                  UPCOMING
                </span>

                <h3>
                  Electronics Lab Report
                </h3>

                <p>
                  In 7 days
                </p>

              </div>

            </div>

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

            <button className="view-all">
              View calendar →
            </button>

          </div>


          <div className="schedule-card">

            <div className="schedule-item">

              <div className="time">
                09:00
                <span>AM</span>
              </div>

              <div className="schedule-line"></div>

              <div className="schedule-info">

                <h3>
                  Data Structures & Algorithms
                </h3>

                <p>
                  Lecture • Engineering Faculty
                </p>

              </div>

            </div>


            <div className="schedule-item">

              <div className="time">
                11:00
                <span>AM</span>
              </div>

              <div className="schedule-line"></div>

              <div className="schedule-info">

                <h3>
                  Study - Algorithms
                </h3>

                <p>
                  Study Session • Library
                </p>

              </div>

            </div>


            <div className="schedule-item">

              <div className="time">
                02:00
                <span>PM</span>
              </div>

              <div className="schedule-line"></div>

              <div className="schedule-info">

                <h3>
                  Analog Electronics
                </h3>

                <p>
                  Lecture • Engineering Faculty
                </p>

              </div>

            </div>

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
            onClick={() => setShowEventForm(true)}
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


            {/* ADD ASSESSMENT */}

            <button className="action-card">

              <div className="action-icon">
                📊
              </div>

              <div>

                <h3>
                  Add Assessment
                </h3>

                <p>
                  Record an exam or grade
                </p>

              </div>

            </button>


          </div>

        </section>

      </main>


      {/* =========================
          ADD TASK MODAL
      ========================= */}

      {showTaskForm && (

        <div
          className="modal-overlay"
          onClick={() => setShowTaskForm(false)}
        >

          <div
            className="task-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>

                <h2>
                  Add New Task
                </h2>

                <p>
                  Create a task for your study plan.
                </p>

              </div>

              <button
                className="close-button"
                onClick={() => setShowTaskForm(false)}
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
                  onClick={() => setShowTaskForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  Add Task
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
                    <h2>Add Event</h2>
                    <p>Create a new schedule event</p>
                </div>

                <button
                    type="button"
                    className="close-button"
                    onClick={() => setShowEventForm(false)}
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
                        Add Event
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