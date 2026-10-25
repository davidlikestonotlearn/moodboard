export function DeleteMoodboardDialog({ title, onClose, onDelete }) {
  return (
    <div className="link-editor-backdrop" onClick={onClose}>
      <div className="link-editor" role="dialog" aria-modal="true" aria-labelledby="delete-moodboard-title" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }}>
        <div className="link-editor-header">
          <h2 id="delete-moodboard-title">Delete moodboard?</h2>
          <button type="button" className="link-editor-close" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <p className="link-editor-help delete-moodboard-help">“{title}” will be removed from Home and All Moodboards.</p>
        <div className="link-editor-actions">
          <button type="button" className="link-editor-cancel" onClick={onClose}>Cancel</button>
          <button type="button" className="link-editor-save" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
