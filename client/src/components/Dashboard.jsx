import React from "react";

function Dashboard({
  user, tasks, events, showAccountMenu, setShowAccountMenu, handleLogout,
  setCurrentView, handleCompleteTask, handleEditTask, handleDeleteTask, setShowTaskForm,
  openNewEventForm, formatDateKey, formatTime
}) {
  return (
<>
        
        {/* HEADER */}

        <header className="header">

          <div>

            <h1>
              Good morning, {user.name}! 👋
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
        {user.profileImage ? <img className="avatar-image" src={user.profileImage} alt="Profile" /> : user.name.charAt(0).toUpperCase()}
    </button>

    {showAccountMenu && (

        <div className="account-menu">

            <div className="account-info">

                <div className="account-avatar">
                    {user.profileImage ? <img className="avatar-image" src={user.profileImage} alt="Profile" /> : user.name.charAt(0).toUpperCase()}
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
                type="button"
                className="logout-button"
                onClick={handleLogout}
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
                      {task.dueDate?.slice(0, 10)}
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
  );
}

export default Dashboard;
