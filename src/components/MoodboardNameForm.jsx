import { useState } from 'react';

export function MoodboardNameForm({ mode, initialTitle = '', onClose, onSave }) {
  const [name, setName] = useState(initialTitle);
  const creating = mode === 'create';

  function submit(event) {
    event.preventDefault();
    const title = name.trim();
    if (title) onSave(title);
  }

  return (
    <div className="link-editor-backdrop" onClick={onClose}>
      <form className="link-editor" role="dialog" aria-modal="true" aria-labelledby="moodboard-name-title" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }} onSubmit={submit}>
        <div className="link-editor-header">
          <h2 id="moodboard-name-title">{creating ? 'Create moodboard' : 'Rename moodboard'}</h2>
          <button type="button" className="link-editor-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <label className="link-field" htmlFor="moodboard-name">
          <span>Moodboard name</span>
          <input id="moodboard-name" type="text" value={name} maxLength={60} autoFocus onChange={(event) => setName(event.target.value)} placeholder="Give your moodboard a name" />
        </label>
        <div className="link-editor-actions">
          <button type="button" className="link-editor-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="link-editor-save" disabled={!name.trim()}>{creating ? 'Create' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
