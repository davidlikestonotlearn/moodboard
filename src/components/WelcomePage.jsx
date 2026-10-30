export function WelcomePage({ onContinueAsGuest }) {
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

        <button className="welcome-button" type="button" disabled>
          Continue With Email
        </button>
        {onContinueAsGuest && (
          <button className="welcome-guest" type="button" onClick={onContinueAsGuest}>
            Continue as guest
          </button>
        )}
      </div>
    </main>
  );
}
