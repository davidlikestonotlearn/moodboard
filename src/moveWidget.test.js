import assert from 'node:assert/strict';
import test from 'node:test';
import { boardItems } from './data/sampleContent.js';
import { moveWidget } from './moveWidget.js';

function assertValidGrid(items) {
  const occupied = new Set();
  for (const { placement } of items) {
    const { column, row, columns, rows } = placement;
    assert.ok(column >= 1 && column + columns <= 3);
    assert.ok(row >= 1 && row + rows <= 5);
    for (let y = row; y < row + rows; y++) {
      for (let x = column; x < column + columns; x++) {
        const cell = `${x},${y}`;
        assert.ok(!occupied.has(cell), `overlap at ${cell}`);
        occupied.add(cell);
      }
    }
  }
}

test('moving each image and the playlist keeps widgets in the grid without overlap', () => {
  for (const widget of boardItems) {
    for (let row = 1; row <= 4; row++) {
      for (let column = 1; column <= 2; column++) {
        const moved = moveWidget(boardItems, widget.id, column, row);
        assert.equal(moved.length, boardItems.length);
        assertValidGrid(moved);
        const target = moved.find((item) => item.id === widget.id).placement;
        assert.equal(target.column, Math.min(column, 3 - widget.placement.columns));
        assert.equal(target.row, Math.min(row, 5 - widget.placement.rows));
      }
    }
  }
});

test('moving after deletion keeps the empty space available', () => {
  const withoutSunset = boardItems.filter((item) => item.id !== 'sunset');
  const moved = moveWidget(withoutSunset, 'ocean', 1, 2);
  assertValidGrid(moved);
  assert.deepEqual(moved.find((item) => item.id === 'ocean').placement, { column: 1, row: 2, columns: 1, rows: 1 });
});

test('playlist can move away from its starting row', () => {
  const moved = moveWidget(boardItems, 'playlist', 2, 1);
  assertValidGrid(moved);
  assert.deepEqual(moved.find((item) => item.id === 'playlist').placement, { column: 1, row: 1, columns: 2, rows: 1 });
});
