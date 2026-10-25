import { useEffect, useRef, useState } from 'react';
import { MoodboardList } from './MoodboardList';

export function ProfilePanel({ profile, boards, initialEditing = false, onSaveProfile, onOpenMoodboard, onClose }) {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [draft, setDraft] = useState(profile);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState('');
  const readerRef = useRef(null);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  useEffect(() => () => readerRef.current?.abort(), []);

  function uploadPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      setError('Choose an image smaller than 10 MB.');
      return;
    }
    setError('');
    setImageLoading(true);
    readerRef.current?.abort();
    const reader = new FileReader();
    readerRef.current = reader;
    reader.onload = () => {
      setDraft((previous) => ({ ...previous, image: String(reader.result) }));
      setImageLoading(false);
      readerRef.current = null;
    };
    reader.onerror = () => {
      setError('The image could not be read. Try another file.');
      setImageLoading(false);
      readerRef.current = null;
    };
    reader.readAsDataURL(file);
  }

  function save(event) {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name || imageLoading) return;
    onSaveProfile({ ...draft, name, bio: draft.bio.trim() });
    setIsEditing(false);
  }

  function cancelEdit() {
    readerRef.current?.abort();
    readerRef.current = null;
    setImageLoading(false);
    setDraft(profile);
    setError('');
    setIsEditing(false);
  }

  return (
    <div className="profile-backdrop" onClick={onClose}>
      <div className="profile-drawer-frame">
        <section className="profile-panel" role="dialog" aria-modal="true" aria-labelledby="profile-title" onClick={(event) => event.stopPropagation()}>
        <div className="profile-panel-header">
          <h2 id="profile-title">Profile</h2>
          <button type="button" className="profile-close" aria-label="Close profile" onClick={onClose}>×</button>
        </div>

        {isEditing ? (
          <form className="profile-edit-form" onSubmit={save}>
            <div className="profile-avatar-editor">
              <img className="profile-avatar" src={draft.image} alt="Profile preview" />
              <label className="profile-photo-button">
                Change photo
                <input className="visually-hidden" type="file" accept="image/*" onChange={uploadPhoto} />
              </label>
            </div>
            <label className="link-field" htmlFor="profile-name">
              <span>Name</span>
              <input id="profile-name" type="text" value={draft.name} maxLength={60} onChange={(event) => setDraft((previous) => ({ ...previous, name: event.target.value }))} />
            </label>
            <label className="link-field" htmlFor="profile-bio">
              <span>Bio</span>
              <textarea id="profile-bio" rows="3" value={draft.bio} maxLength={160} onChange={(event) => setDraft((previous) => ({ ...previous, bio: event.target.value }))} placeholder="A little about you" />
            </label>
            {error && <p className="link-editor-error" role="alert">{error}</p>}
            <div className="link-editor-actions profile-edit-actions">
              <button type="button" className="link-editor-cancel" onClick={cancelEdit}>Cancel</button>
              <button type="submit" className="link-editor-save" disabled={!draft.name.trim() || imageLoading}>{imageLoading ? 'Loading photo…' : 'Save profile'}</button>
            </div>
          </form>
        ) : (
          <div className="profile-overview">
            <img className="profile-avatar" src={profile.image} alt="" />
            <h3>{profile.name}</h3>
            {profile.bio && <p>{profile.bio}</p>}
            <button type="button" className="profile-edit-button" onClick={() => setIsEditing(true)}>Edit profile</button>
          </div>
        )}

        <section className="profile-boards" aria-labelledby="profile-boards-title">
          <h3 id="profile-boards-title">My Moodboards</h3>
          <MoodboardList boards={boards} onOpenMoodboard={onOpenMoodboard} emptyMessage="No moodboards yet." />
        </section>
        </section>
      </div>
    </div>
  );
}
