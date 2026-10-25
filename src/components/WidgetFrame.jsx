import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

export function WidgetFrame({ as: Component = 'div', className, style, isEditing = false, onLongPress, onDelete, onMove, onEditLink, hasSpotifyLink = false, deleteLabel, children, ...props }) {
  const holdTimer = useRef(null);
  const startPoint = useRef(null);
  const dragPoint = useRef(null);
  const suppressClick = useRef(false);
  const [dragOffset, setDragOffset] = useState(null);
  const [isHolding, setIsHolding] = useState(false);

  function cancelHold() {
    clearTimeout(holdTimer.current);
    holdTimer.current = null;
    startPoint.current = null;
    setIsHolding(false);
  }

  useEffect(() => () => clearTimeout(holdTimer.current), []);

  function startPointer(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    suppressClick.current = false;
    if (isEditing && onMove) {
      dragPoint.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }
    if (!onLongPress || isEditing) return;
    cancelHold();
    // Let ordinary Spotify links receive their click; capture is only needed
    // on widgets without a link under the pointer.
    if (!event.target.closest?.('a[href]')) event.currentTarget.setPointerCapture(event.pointerId);
    startPoint.current = { x: event.clientX, y: event.clientY };
    setIsHolding(true);
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      startPoint.current = null;
      setIsHolding(false);
      suppressClick.current = true;
      onLongPress();
    }, 1000);
  }

  function checkMovement(event) {
    if (dragPoint.current?.pointerId === event.pointerId) {
      const x = event.clientX - dragPoint.current.x;
      const y = event.clientY - dragPoint.current.y;
      setDragOffset(Math.hypot(x, y) > 6 ? { x, y } : null);
      return;
    }
    if (startPoint.current && Math.hypot(event.clientX - startPoint.current.x, event.clientY - startPoint.current.y) > 8) cancelHold();
  }

  function finishPointer(event) {
    cancelHold();
    if (dragPoint.current?.pointerId !== event.pointerId) return;
    const distance = Math.hypot(event.clientX - dragPoint.current.x, event.clientY - dragPoint.current.y);
    dragPoint.current = null;
    setDragOffset(null);
    if (event.type === 'pointerup' && distance > 6) {
      suppressClick.current = true;
      onMove?.(event.clientX, event.clientY);
    }
  }

  return (
    <Component
      {...props}
      className={`board-widget ${className}${onLongPress ? ' is-interactive' : ''}${isEditing ? ' is-editing' : ''}${isHolding ? ' is-holding' : ''}${dragOffset ? ' is-dragging' : ''}`}
      style={{ ...style, transform: dragOffset ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)` : undefined }}
      onPointerDown={startPointer}
      onPointerMove={checkMovement}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
      onClickCapture={(event) => {
        if (!suppressClick.current) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClick.current = false;
      }}
      onContextMenu={onLongPress ? (event) => event.preventDefault() : undefined}
    >
      {children}
      {isEditing && onDelete && (
        <button
          type="button"
          className="delete-widget-button"
          aria-label={`Delete ${deleteLabel}`}
          onPointerDown={(event) => { suppressClick.current = false; event.stopPropagation(); }}
          onClick={onDelete}
        >
          ×
        </button>
      )}
      {isEditing && onEditLink && (
        <button
          type="button"
          className={`edit-link-button${hasSpotifyLink ? ' has-link' : ''}`}
          aria-label={`Edit Spotify links for ${deleteLabel}`}
          onPointerDown={(event) => { suppressClick.current = false; event.stopPropagation(); }}
          onClick={onEditLink}
        >
          <Icon name="link" />
        </button>
      )}
    </Component>
  );
}
