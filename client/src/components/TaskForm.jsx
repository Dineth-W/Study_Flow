function TaskForm({ showTaskForm, newTask, setNewTask, editingTaskId, onSubmit, onClose }) {
  const handleSubmit = onSubmit;
  const closeTaskForm = onClose;
  return (
      showTaskForm ? (

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

            <form onSubmit={handleSubmit}>

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

      ) : null
  );
}

export default TaskForm;
