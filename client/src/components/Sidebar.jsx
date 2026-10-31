function Sidebar({
  currentView, setCurrentView, setShowAccountMenu,
  setSettingsMessage, setSettingsError
}) {
  const openSettings = () => {
    setCurrentView("settings");
    setShowAccountMenu(false);
    setSettingsMessage("");
    setSettingsError("");
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">S</div>
        <span>StudyFlow</span>
      </div>
      <nav className="navigation">
        <button
          className={`nav-item ${currentView === "dashboard" ? "active" : ""}`}
          onClick={() => setCurrentView("dashboard")}
        >
          <span>🏠</span> Dashboard
        </button>
        <button
          className={`nav-item ${currentView === "calendar" ? "active" : ""}`}
          onClick={() => setCurrentView("calendar")}
        >
          <span>📅</span> Calendar
        </button>
      </nav>
      <div className="sidebar-bottom">
        <button
          type="button"
          className={`nav-item ${currentView === "settings" ? "active" : ""}`}
          onClick={openSettings}
        >
          <span>⚙️</span> Settings
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
