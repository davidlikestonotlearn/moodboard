import { MudoMark } from './MudoMark';

export function WelcomePage({ onContinueAsGuest }) {
  return (
    <main className="welcome-page" aria-label="Welcome to MUDO">
      <header className="welcome-header">
        <MudoMark />
        <span className="welcome-corner-tile mudo-offset" aria-hidden="true" />
      </header>

      <div className="welcome-hero">
        <p className="welcome-tagline">MOODBOARD &amp; MUSIC</p>
        <img className="welcome-collage" src="/images/mudo-welcome-collage.png" alt="A window-side café scene arranged as a photo grid" />
        <p className="welcome-title"><span>WELCOME TO</span> <strong>MUDO</strong></p>
      </div>

      <div className="welcome-actions">
        <button className="welcome-button mudo-offset" type="button" disabled>
          <img src="/icons/google.svg" alt="" aria-hidden="true" />
          <span>Sign In With Google</span>
        </button>
        <button className="welcome-button mudo-offset" type="button" disabled>
          <img src="/icons/apple.svg" alt="" aria-hidden="true" />
          <span>Sign In With Apple</span>
        </button>

        <div className="welcome-divider">OR</div>

        <button className="welcome-button mudo-offset" type="button" disabled>
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
