export const WIDGET_SIZES = [
  { id: '1x1', columns: 1, rows: 1, label: 'Small square' },
  { id: '2x1', columns: 2, rows: 1, label: 'Wide' },
  { id: '1x2', columns: 1, rows: 2, label: 'Tall' },
  { id: '2x2', columns: 2, rows: 2, label: 'Large' },
];

export function playlistTrackLimit(size) {
  if (size?.columns !== 2) return 0;
  if (size.rows === 1) return 3;
  if (size.rows === 2) return 6;
  return 0;
}

function cellsOf(placement) {
  const cells = [];
  for (let row = placement.row; row < placement.row + placement.rows; row++) {
    for (let column = placement.column; column < placement.column + placement.columns; column++) {
      cells.push(`${column},${row}`);
    }
  }
  return cells;
}

export function availablePlacements(items, size) {
  const occupied = new Set(items.flatMap((item) => cellsOf(item.placement)));
  const placements = [];
  for (let row = 1; row <= 5 - size.rows; row++) {
    for (let column = 1; column <= 3 - size.columns; column++) {
      const placement = { column, row, columns: size.columns, rows: size.rows };
      if (cellsOf(placement).every((cell) => !occupied.has(cell))) placements.push(placement);
    }
  }
  return placements;
}
