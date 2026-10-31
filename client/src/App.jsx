import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import AuthPage from "./components/AuthPage";
import Sidebar from "./components/Sidebar";
import SettingsPage from "./components/SettingsPage";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";
import TaskForm from "./components/TaskForm";
import EventForm from "./components/EventForm";

const API_URL = "http://localhost:5000/api";
const emptyTask = { title: "", subject: "", dueDate: "", priority: "Medium" };
const emptyEvent = {
  title: "", subject: "", date: "", startTime: "", endTime: "",
  location: "", type: "Lecture"
};
const emptyAuthForm = { name: "", email: "", password: "" };

function App() {

  // -----------------------------
  // TASK STATE
  // -----------------------------

  const [tasks, setTasks] = useState([]);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [newTask, setNewTask] = useState({ ...emptyTask });

  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedDate, setSelectedDate] = useState(null);

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [settingsMessage, setSettingsMessage] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);

const [token, setToken] = useState(
  () => localStorage.getItem("studyflow_token")
);

const [user, setUser] = useState(() => {
  try {
    const savedUser = localStorage.getItem("studyflow_user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
});

const [authMode, setAuthMode] = useState("login");
const [authForm, setAuthForm] = useState({ ...emptyAuthForm });
const [authError, setAuthError] = useState("");
const [authLoading, setAuthLoading] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date());

const [newEvent, setNewEvent] = useState({ ...emptyEvent });

  useEffect(() => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}, [token]);

useEffect(() => {
  if (!token || !user) {
    setTasks([]);
    setEvents([]);
    return;
  }

  fetchTasks();
  fetchEvents();
}, [token, user]);

const fetchTasks = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/tasks`
    );

    setTasks(response.data);

  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  }
};

const fetchEvents = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/events`
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
        `${API_URL}/tasks/${editingTaskId}`,
        newTask
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === editingTaskId ? response.data : task
        )
      );
    } else {
      const response = await axios.post(
        `${API_URL}/tasks`,
        newTask
      );

      setTasks((currentTasks) => [
        ...currentTasks,
        response.data
      ]);
    }

    setNewTask({ ...emptyTask });
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
  setNewTask({ ...emptyTask });
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
                `${API_URL}/events/${editingEventId}`,
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
                `${API_URL}/events`,
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
        await axios.delete(`${API_URL}/events/${eventId}`);
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
      `${API_URL}/tasks/${id}`
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
      `${API_URL}/tasks/${id}`,
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

const handleAuthSubmit = async (e) => {
  e.preventDefault();
  setAuthError("");
  setAuthLoading(true);

  try {
    const endpoint =
      authMode === "login" ? "login" : "register";

    const payload =
      authMode === "login"
        ? {
            email: authForm.email,
            password: authForm.password
          }
        : {
            name: authForm.name,
            email: authForm.email,
            password: authForm.password
          };

    const response = await axios.post(
      `${API_URL}/auth/${endpoint}`,
      payload
    );

    const { token: newToken, user: loggedInUser } = response.data;
    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    localStorage.setItem("studyflow_token", newToken);
    localStorage.setItem("studyflow_user", JSON.stringify(loggedInUser));
    setToken(newToken);
    setUser(loggedInUser);
    setAuthForm({ ...emptyAuthForm });
    setShowAccountMenu(false);
  } catch (error) {
    setAuthError(
      error.response?.data?.message ||
      "Authentication failed. Check that the server is running."
    );
  } finally {
    setAuthLoading(false);
  }
};

const handleChangePassword = async (e) => {
  e.preventDefault();
  setSettingsMessage("");
  setSettingsError("");

  if (passwordForm.newPassword.length < 6) {
    setSettingsError("The new password must be at least 6 characters.");
    return;
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    setSettingsError("The new passwords do not match.");
    return;
  }

  setSettingsLoading(true);
  try {
    const response = await axios.put(`${API_URL}/auth/change-password`, {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
    setSettingsMessage(response.data.message || "Password changed successfully.");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  } catch (error) {
    setSettingsError(error.response?.data?.message || "Could not change the password.");
  } finally {
    setSettingsLoading(false);
  }
};

const handleProfileImage = async (e) => {
  const file = e.target.files?.[0];
  e.target.value = "";
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
    setSettingsError("Choose a JPG, PNG, WEBP or GIF image.");
    setSettingsMessage("");
    return;
  }
  if (file.size > 1.5 * 1024 * 1024) {
    setSettingsError("The image must be smaller than 1.5 MB.");
    setSettingsMessage("");
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, { profileImage: reader.result });
      const updatedUser = { ...user, ...response.data.user };
      setUser(updatedUser);
      localStorage.setItem("studyflow_user", JSON.stringify(updatedUser));
      setSettingsError("");
      setSettingsMessage("Profile picture saved.");
    } catch (error) {
      setSettingsError(error.response?.data?.message || "Could not save the profile picture.");
      setSettingsMessage("");
    }
  };
  reader.onerror = () => setSettingsError("Could not read that image.");
  reader.readAsDataURL(file);
};

const handleRemoveProfileImage = async () => {
  setSettingsMessage("");
  setSettingsError("");
  try {
    const response = await axios.put(`${API_URL}/auth/profile`, { profileImage: "" });
    const updatedUser = { ...user, ...response.data.user };
    setUser(updatedUser);
    localStorage.setItem("studyflow_user", JSON.stringify(updatedUser));
    setSettingsMessage("Profile picture removed.");
  } catch (error) {
    setSettingsError(error.response?.data?.message || "Could not remove the profile picture.");
  }
};

const handleLogout = () => {
  localStorage.removeItem("studyflow_token");
  localStorage.removeItem("studyflow_user");

  delete axios.defaults.headers.common.Authorization;

  setToken(null);
  setUser(null);
  setTasks([]);
  setEvents([]);
  setShowAccountMenu(false);
  setCurrentView("dashboard");
  setAuthForm({ ...emptyAuthForm });
  setAuthError("");
  setAuthMode("login");
};

if (!token || !user) {
  return (
    <AuthPage
      authMode={authMode}
      setAuthMode={setAuthMode}
      authForm={authForm}
      setAuthForm={setAuthForm}
      authError={authError}
      setAuthError={setAuthError}
      authLoading={authLoading}
      handleAuthSubmit={handleAuthSubmit}
    />
  );
}

  return (
    <div className="app">

      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        setShowAccountMenu={setShowAccountMenu}
        setSettingsMessage={setSettingsMessage}
        setSettingsError={setSettingsError}
      />

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="main-content">

    {currentView === "dashboard" ? (
      <Dashboard
        user={user}
        tasks={tasks}
        events={events}
        showAccountMenu={showAccountMenu}
        setShowAccountMenu={setShowAccountMenu}
        handleLogout={handleLogout}
        setCurrentView={setCurrentView}
        handleCompleteTask={handleCompleteTask}
        handleEditTask={handleEditTask}
        handleDeleteTask={handleDeleteTask}
        setShowTaskForm={setShowTaskForm}
        openNewEventForm={openNewEventForm}
        formatDateKey={formatDateKey}
        formatTime={formatTime}
      />
    ) : currentView === "calendar" ? (
      <Calendar
        events={events}
        currentMonth={currentMonth}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
        goToToday={goToToday}
        getCalendarDays={getCalendarDays}
        formatDateKey={formatDateKey}
        getEventsForDate={getEventsForDate}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        formatDisplayDate={formatDisplayDate}
        formatTime={formatTime}
        handleEditEvent={handleEditEvent}
        handleDeleteEvent={handleDeleteEvent}
      />
    ) : (
      <SettingsPage
        user={user}
        passwordForm={passwordForm}
        setPasswordForm={setPasswordForm}
        handleChangePassword={handleChangePassword}
        handleProfileImage={handleProfileImage}
        handleRemoveProfileImage={handleRemoveProfileImage}
        settingsLoading={settingsLoading}
        settingsMessage={settingsMessage}
        settingsError={settingsError}
      />
    )}

      </main>

          <TaskForm
        showTaskForm={showTaskForm}
        newTask={newTask}
        setNewTask={setNewTask}
        editingTaskId={editingTaskId}
        onSubmit={handleAddTask}
        onClose={closeTaskForm}
      />

      <EventForm
        showEventForm={showEventForm}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        editingEventId={editingEventId}
        onSubmit={handleAddEvent}
        onClose={closeEventForm}
      />

    </div>
  );
}

export default App;