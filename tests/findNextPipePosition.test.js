const test = require('node:test');
const assert = require('node:assert/strict');
const { findNextPipePosition } = require('../findNextPipePosition');

test('moves forward on straight pipe without backtracking', () => {
  const grid = [
    ['horizontal', 'horizontal', 'horizontal'],
    [null, null, null],
    [null, null, null]
  ];
  const result = findNextPipePosition(grid, 1, 0, 0, 0);
  assert.deepStrictEqual(result, { x: 2, y: 0 });
});

test('turns correctly on corner pipe', () => {
  const grid = [
    [null, 'vertical', null],
    [null, 'corner-tr', 'horizontal'],
    [null, null, null]
  ];
  const result = findNextPipePosition(grid, 1, 1, 1, 0);
  assert.deepStrictEqual(result, { x: 2, y: 1 });
});

test('cross pipe prefers straight path and avoids backtracking', () => {
  const grid = [
    [null, null, null],
    ['horizontal', 'cross', 'horizontal'],
    [null, 'vertical', null]
  ];
  const result = findNextPipePosition(grid, 1, 1, 0, 1);
  assert.deepStrictEqual(result, { x: 2, y: 1 });
});
