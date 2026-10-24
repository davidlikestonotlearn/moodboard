import { useRef } from 'react';
import { ImageWidget } from './ImageWidget';
import { PlaylistWidget } from './PlaylistWidget';

export function Moodboard({ items, isEditing = false, onImageLongPress, onDeleteImage, onMoveImage }) {
  const boardRef = useRef(null);

  function moveToPointer(id, clientX, clientY) {
    if (!onMoveImage || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(boardRef.current).gap) || 0;
    const cell = (rect.width - gap) / 2;
    const column = Math.floor((clientX - rect.left) / (cell + gap)) + 1;
    const row = Math.floor((clientY - rect.top) / (cell + gap)) + 1;
    onMoveImage(id, column, row);
  }

  return (
    <div ref={boardRef} className={`moodboard${isEditing ? ' is-editing' : ''}`}>
      {items.map(({ id, type, placement, ...content }) => {
        const style = {
          gridColumn: `${placement.column} / span ${placement.columns}`,
          gridRow: `${placement.row} / span ${placement.rows}`,
        };
        return type === 'playlist'
          ? <PlaylistWidget key={id} {...content} style={style} />
          : <ImageWidget key={id} {...content} style={style} isEditing={isEditing} onLongPress={onImageLongPress} onDelete={onDeleteImage ? () => onDeleteImage(id) : undefined} onMove={onMoveImage ? (x, y) => moveToPointer(id, x, y) : undefined} />;
      })}
    </div>
  );
}
