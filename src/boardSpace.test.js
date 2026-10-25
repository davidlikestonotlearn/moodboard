import assert from 'node:assert/strict';
import test from 'node:test';
import { availablePlacements, playlistTrackLimit, WIDGET_SIZES } from './boardSpace.js';

test('playlist uses only wide or large sizes at the same track density', () => {
  assert.deepEqual(WIDGET_SIZES.map(playlistTrackLimit), [0, 3, 0, 6]);
});

test('only a single square fits when the board has one cell left', () => {
  const items = [
    { placement: { column: 1, row: 1, columns: 2, rows: 2 } },
    { placement: { column: 1, row: 3, columns: 2, rows: 1 } },
    { placement: { column: 1, row: 4, columns: 1, rows: 1 } },
  ];
  assert.deepEqual(availablePlacements(items, WIDGET_SIZES[0]), [{ column: 2, row: 4, columns: 1, rows: 1 }]);
  for (const size of WIDGET_SIZES.slice(1)) assert.equal(availablePlacements(items, size).length, 0);
});

test('wide widgets need adjacent free cells, not just two empty cells', () => {
  const items = [
    { placement: { column: 2, row: 1, columns: 1, rows: 1 } },
    { placement: { column: 1, row: 2, columns: 2, rows: 2 } },
    { placement: { column: 1, row: 4, columns: 1, rows: 1 } },
  ];
  assert.equal(availablePlacements(items, WIDGET_SIZES[0]).length, 2);
  assert.equal(availablePlacements(items, WIDGET_SIZES[1]).length, 0);
});
