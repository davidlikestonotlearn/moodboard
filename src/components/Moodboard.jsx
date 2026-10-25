import { useRef } from 'react';
import { ImageWidget } from './ImageWidget';
import { SongWidget } from './SongWidget';
import { PlaylistWidget } from './PlaylistWidget';
import { playlistTrackLimit } from '../boardSpace';

export function Moodboard({ items, isEditing = false, linksEnabled = false, onWidgetLongPress, onAddWidget, onDeleteWidget, onMoveWidget, onEditWidgetLink }) {
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
      {items.length === 0 && (
        <>
          {Array.from({ length: 8 }, (_, index) => <div key={index} className="empty-board-slot" aria-hidden="true" />)}
          {onAddWidget && <button type="button" className="empty-board-action" onClick={onAddWidget}>Your moodboard is empty.<br />Tap anywhere to add a widget.</button>}
        </>
      )}
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
          onEditLink: type !== 'image' && onEditWidgetLink ? () => onEditWidgetLink(id) : undefined,
          linksEnabled,
        };
        return type === 'playlist'
          ? <PlaylistWidget key={id} {...content} style={style} maxTracks={playlistTrackLimit(placement)} {...editingProps} />
          : type === 'song'
            ? <SongWidget key={id} {...content} style={style} {...editingProps} />
            : <ImageWidget key={id} {...content} style={style} {...editingProps} />;
      })}
    </div>
  );
}
