import { useEffect, useRef } from 'react';

export function ImageWidget({ src, alt, position = 'center', className = '', style, isEditing = false, onLongPress, onDelete }) {
  const holdTimer = useRef(null);
  const startPoint = useRef(null);

  function cancelHold() {
    clearTimeout(holdTimer.current);
    holdTimer.current = null;
    startPoint.current = null;
  }

  useEffect(() => () => clearTimeout(holdTimer.current), []);

  function startHold(event) {
    if (!onLongPress || isEditing || (event.pointerType === 'mouse' && event.button !== 0)) return;
    cancelHold();
    startPoint.current = { x: event.clientX, y: event.clientY };
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      startPoint.current = null;
      onLongPress();
    }, 2000);
  }

  function checkMovement(event) {
    if (startPoint.current && Math.hypot(event.clientX - startPoint.current.x, event.clientY - startPoint.current.y) > 8) cancelHold();
  }

  return (
    <figure
      className={`image-widget${isEditing ? ' is-editing' : ''} ${className}`}
      style={style}
      onPointerDown={startHold}
      onPointerMove={checkMovement}
      onPointerUp={cancelHold}
      onPointerCancel={cancelHold}
      onPointerLeave={cancelHold}
      onContextMenu={onLongPress ? (event) => event.preventDefault() : undefined}
    >
      <img src={src} alt={alt} style={{ objectPosition: position }} draggable="false" />
      {isEditing && onDelete && (
        <button
          type="button"
          className="delete-image-button"
          aria-label={`Delete ${alt}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onDelete}
        >
          ×
        </button>
      )}
    </figure>
  );
}
