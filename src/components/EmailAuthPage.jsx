import { useState } from 'react';

export function EmailAuthPage({ onBack, onSignIn, onRegister }) {
  const [step, setStep] = useState('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submitCredentials(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = await onSignIn(email, password);
      if (result.needsProfile) setStep('profile');
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitProfile(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onRegister({ email, password, name, image });
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  }

  function choosePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setError('Choose a PNG, JPEG, or WebP image under 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setImage(String(reader.result)); setError(''); };
    reader.onerror = () => setError('Could not read the photo. Try another image.');
    reader.readAsDataURL(file);
  }

  return (
    <main className="email-auth-page">
      <div className="email-auth-inner">
        <button type="button" className="email-auth-back" onClick={step === 'profile' ? () => { setStep('credentials'); setError(''); } : onBack} aria-label="Back">←</button>
        <h1>{step === 'profile' ? 'Create your profile' : 'Continue with email'}</h1>
        <p>{step === 'profile' ? 'Choose a name, then add a photo if you like.' : 'Enter your email and password to sign in or start a new account.'}</p>
        {step === 'credentials' ? (
          <form className="email-auth-form" onSubmit={submitCredentials}>
            <label>Email<input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label>Password<input type="password" required minLength="8" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            {error && <p className="email-auth-error" role="alert">{error}</p>}
            <button type="submit" disabled={busy}>{busy ? 'Checking…' : 'Continue'}</button>
          </form>
        ) : (
          <form className="email-auth-form" onSubmit={submitProfile}>
            <label>Name<input type="text" required maxLength="60" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="What should we call you?" /></label>
            <label><span>Profile photo <span className="email-auth-optional">optional</span></span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={choosePhoto} /></label>
            {image && <img className="email-auth-preview" src={image} alt="Your profile preview" />}
            {error && <p className="email-auth-error" role="alert">{error}</p>}
            <button type="submit" disabled={busy || !name.trim()}>{busy ? 'Creating account…' : 'Create account'}</button>
          </form>
        )}
      </div>
    </main>
  );
}
