import { useRef } from 'react';
import { ImageWidget } from './ImageWidget';
import { PlaylistWidget } from './PlaylistWidget';

export function Moodboard({ items, isEditing = false, onWidgetLongPress, onDeleteWidget, onMoveWidget }) {
  const boardRef = useRef(null);

  function moveToPointer(id, clientX, clientY) {
    if (!onMoveWidget || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(boardRef.current).gap) || 0;
    const cell = (rect.width - gap) / 2;
    const column = Math.floor((clientX - rect.left) / (cell + gap)) + 1;
    const row = Math.floor((clientY - rect.top) / (cell + gap)) + 1;
    onMoveWidget(id, column, row);
  }

  return (
    <div ref={boardRef} className={`moodboard${isEditing ? ' is-editing' : ''}`}>
      {items.map(({ id, type, placement, ...content }) => {
        const style = {
          gridColumn: `${placement.column} / span ${placement.columns}`,
          gridRow: `${placement.row} / span ${placement.rows}`,
        };
        const editingProps = {
          isEditing,
          onLongPress: onWidgetLongPress,
          onDelete: onDeleteWidget ? () => onDeleteWidget(id) : undefined,
          onMove: onMoveWidget ? (x, y) => moveToPointer(id, x, y) : undefined,
        };
        return type === 'playlist'
          ? <PlaylistWidget key={id} {...content} style={style} {...editingProps} />
          : <ImageWidget key={id} {...content} style={style} {...editingProps} />;
      })}
    </div>
  );
}
