import { useEffect, useRef, useState } from 'react';

export function WidgetFrame({ as: Component = 'div', className, style, isEditing = false, onLongPress, onDelete, onMove, deleteLabel, children, ...props }) {
  const holdTimer = useRef(null);
  const startPoint = useRef(null);
  const dragPoint = useRef(null);
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
    if (isEditing && onMove) {
      dragPoint.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }
    if (!onLongPress || isEditing) return;
    cancelHold();
    event.currentTarget.setPointerCapture(event.pointerId);
    startPoint.current = { x: event.clientX, y: event.clientY };
    setIsHolding(true);
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      startPoint.current = null;
      setIsHolding(false);
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
    if (event.type === 'pointerup' && distance > 6) onMove?.(event.clientX, event.clientY);
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
      onContextMenu={onLongPress ? (event) => event.preventDefault() : undefined}
    >
      {children}
      {isEditing && onDelete && (
        <button
          type="button"
          className="delete-widget-button"
          aria-label={`Delete ${deleteLabel}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onDelete}
        >
          ×
        </button>
      )}
    </Component>
  );
}
