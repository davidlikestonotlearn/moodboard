const BOARD_COLUMNS = 2;
const BOARD_ROWS = 4;

function placementsFor(item) {
  const { columns, rows } = item.placement;
  const placements = [];
  for (let row = 1; row <= BOARD_ROWS - rows + 1; row++) {
    for (let column = 1; column <= BOARD_COLUMNS - columns + 1; column++) {
      placements.push({ column, row, columns, rows });
    }
  }
  return placements;
}

function cellsFor(placement) {
  const cells = [];
  for (let row = placement.row; row < placement.row + placement.rows; row++) {
    for (let column = placement.column; column < placement.column + placement.columns; column++) {
      cells.push((row - 1) * BOARD_COLUMNS + column - 1);
    }
  }
  return cells;
}

// Keep the dragged image at its destination and place the remaining widgets
// as close as possible to where they were before the move.
export function moveImage(items, imageId, column, row) {
  const image = items.find((item) => item.id === imageId && item.type === 'image');
  if (!image) return items;

  const destination = {
    ...image.placement,
    column: Math.max(1, Math.min(column, BOARD_COLUMNS - image.placement.columns + 1)),
    row: Math.max(1, Math.min(row, BOARD_ROWS - image.placement.rows + 1)),
  };
  if (destination.column === image.placement.column && destination.row === image.placement.row) return items;

  const others = items.filter((item) => item.id !== imageId);
  const solution = new Map([[imageId, destination]]);
  let best = null;
  let bestCost = Infinity;

  function arrange(index, occupied, cost) {
    if (cost >= bestCost) return;
    if (index === others.length) {
      bestCost = cost;
      best = new Map(solution);
      return;
    }

    const item = others[index];
    const options = placementsFor(item).sort((a, b) => {
      const distance = (place) => Math.abs(place.column - item.placement.column) + Math.abs(place.row - item.placement.row);
      return distance(a) - distance(b);
    });

    for (const place of options) {
      const cells = cellsFor(place);
      if (cells.some((cell) => occupied.has(cell))) continue;
      solution.set(item.id, place);
      const distance = Math.abs(place.column - item.placement.column) + Math.abs(place.row - item.placement.row);
      arrange(index + 1, new Set([...occupied, ...cells]), cost + distance);
    }
  }

  arrange(0, new Set(cellsFor(destination)), 0);
  return best ? items.map((item) => ({ ...item, placement: best.get(item.id) })) : items;
}
