function AuthPage({
  authMode, setAuthMode, authForm, setAuthForm,
  authError, setAuthError, authLoading, handleAuthSubmit
}) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">S</div>
          <span>StudyFlow</span>
        </div>
        <h1>{authMode === "login" ? "Welcome back!" : "Create your account"}</h1>
        <p className="auth-subtitle">
          {authMode === "login"
            ? "Sign in to continue your study journey."
            : "Start organizing your studies with StudyFlow."}
        </p>

        <form onSubmit={handleAuthSubmit}>
          {authMode === "register" && (
            <div className="form-group">
              <label>Full name</label>
              <input
                type="text" required autoComplete="name"
                placeholder="Enter your name" value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
              />
            </div>
          )}
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email" required autoComplete="email"
              placeholder="you@example.com" value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" required minLength={6}
              autoComplete={authMode === "login" ? "current-password" : "new-password"}
              placeholder="At least 6 characters" value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            />
          </div>
          {authError && <p className="auth-error" role="alert">{authError}</p>}
          <button type="submit" className="auth-submit" disabled={authLoading}>
            {authLoading ? "Please wait..." : authMode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setAuthMode(authMode === "login" ? "register" : "login");
              setAuthError("");
              setAuthForm({ name: "", email: "", password: "" });
            }}
          >
            {authMode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
