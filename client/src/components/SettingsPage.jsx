function SettingsPage({
  user, passwordForm, setPasswordForm, handleChangePassword,
  handleProfileImage, handleRemoveProfileImage, settingsLoading,
  settingsMessage, settingsError
}) {
  return (
    <section className="section settings-section">
      <div className="section-title">
        <div>
          <h2>Settings</h2>
          <p>Manage your profile and account security.</p>
        </div>
      </div>

      <div className="settings-card">
        <h3>Profile picture</h3>
        <p>Choose a JPG, PNG, WEBP or GIF image (maximum 1.5 MB).</p>
        <div className="settings-profile-row">
          <div className="settings-avatar">
            {user.profileImage
              ? <img className="avatar-image" src={user.profileImage} alt="Profile preview" />
              : user.name.charAt(0).toUpperCase()}
          </div>
          <label className="save-button settings-upload-button">
            Choose image
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleProfileImage}
            />
          </label>
          {user.profileImage && (
            <button type="button" className="cancel-button" onClick={handleRemoveProfileImage}>
              Remove image
            </button>
          )}
        </div>
      </div>

      <div className="settings-card">
        <h3>Change password</h3>
        <p>Use your current password to set a new one.</p>
        <form onSubmit={handleChangePassword} className="settings-form">
          <div className="form-group">
            <label>Current password</label>
            <input
              type="password" autoComplete="current-password" required
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>New password</label>
            <input
              type="password" autoComplete="new-password" minLength={6} required
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Confirm new password</label>
            <input
              type="password" autoComplete="new-password" minLength={6} required
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </div>
          <button type="submit" className="save-button" disabled={settingsLoading}>
            {settingsLoading ? "Saving..." : "Change password"}
          </button>
        </form>
      </div>

      {settingsMessage && <p className="settings-success" role="status">{settingsMessage}</p>}
      {settingsError && <p className="settings-error" role="alert">{settingsError}</p>}
    </section>
  );
}

export default SettingsPage;
