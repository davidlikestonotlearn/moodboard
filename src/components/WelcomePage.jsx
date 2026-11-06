export function WelcomePage({ onContinueAsGuest, onEmail, loading = false, error = '' }) {
  return (
    <main className="welcome-page" aria-label="Welcome to MUDO">
      <div className="welcome-spacer" aria-hidden="true" />

      <div className="welcome-actions">
        <button className="welcome-button" type="button" disabled>
          <img src="/icons/google.svg" alt="" aria-hidden="true" />
          <span>Sign In With Google</span>
        </button>
        <button className="welcome-button" type="button" disabled>
          <img src="/icons/apple.svg" alt="" aria-hidden="true" />
          <span>Sign In With Apple</span>
        </button>

        <div className="welcome-divider">OR</div>

        <button className="welcome-button" type="button" onClick={onEmail}>
          Continue With Email
        </button>
        {onContinueAsGuest && (
          <button className="welcome-guest" type="button" disabled={loading} onClick={onContinueAsGuest}>
            {loading ? 'Opening guest moodboards…' : 'Continue as guest'}
          </button>
        )}
        {error && <p className="guest-entry-error" role="alert">{error}</p>}
      </div>
    </main>
  );
}
