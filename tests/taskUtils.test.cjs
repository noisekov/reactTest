const test = require('node:test');
const assert = require('node:assert/strict');
const { isOverdue, sortTasksByStartDay, parseDisplayDate } = require('../.test-dist/entities/task/model/task.utils.js');
const { filterTasks } = require('../.test-dist/features/task-search/model/filterTasks.js');
const { tasksReducer } = require('../.test-dist/entities/task/model/task.reducer.js');

const today = new Date(2026, 10, 19, 12, 0, 0).getTime();
const yesterday = new Date(2026, 10, 18, 0, 0, 0).getTime();
const dueToday = new Date(2026, 10, 19, 0, 0, 0).getTime();

function makeTask(overrides = {}) {
  return {
    id: 1,
    type: 'todo',
    startDay: dueToday,
    endDay: dueToday,
    text: 'Test task',
    ...overrides
  };
}

test('isOverdue returns true for a past deadline and false for a deadline today', () => {
  assert.equal(isOverdue(makeTask({ endDay: yesterday }), today), true);
  assert.equal(isOverdue(makeTask({ endDay: dueToday }), today), false);
});

test('isOverdue ignores tasks with done status', () => {
  assert.equal(isOverdue(makeTask({ type: 'done', endDay: yesterday }), today), false);
});

test('sortTasksByStartDay sorts ascending without mutating the input', () => {
  const tasks = [makeTask({ id: 2, startDay: 30 }), makeTask({ id: 1, startDay: 10 })];
  const result = sortTasksByStartDay(tasks);

  assert.deepEqual(result.map((task) => task.id), [1, 2]);
  assert.deepEqual(tasks.map((task) => task.id), [2, 1]);
});

test('filterTasks matches text case-insensitively and matches either date field', () => {
  const start = new Date(2026, 0, 5, 0, 0, 0).getTime();
  const end = new Date(2026, 0, 6, 0, 0, 0).getTime();
  const task = makeTask({ startDay: start, endDay: end, text: 'Prepare Release Notes' });

  assert.equal(filterTasks([task], 'release').length, 1);
  assert.equal(filterTasks([task], '06.01.2026').length, 1);
  assert.equal(filterTasks([task], '07.01.2026').length, 0);
});

test('tasksReducer creates, updates, moves and deletes tasks immutably', () => {
  const original = [makeTask()];
  const created = tasksReducer(original, {
    type: 'task/created',
    payload: { type: 'review', startDay: 10, endDay: 20, text: 'Review changes' }
  });
  const updated = tasksReducer(created, {
    type: 'task/updated',
    payload: { id: 1, changes: { type: 'in_progress', startDay: 1, endDay: 2, text: 'Updated' } }
  });
  const moved = tasksReducer(updated, {
    type: 'task/moved',
    payload: { id: 2, status: 'done' }
  });
  const deleted = tasksReducer(moved, { type: 'task/deleted', payload: { id: 1 } });

  assert.equal(original[0].text, 'Test task');
  assert.equal(created[1].id, 2);
  assert.equal(updated[0].text, 'Updated');
  assert.equal(moved[1].type, 'done');
  assert.deepEqual(deleted.map((task) => task.id), [2]);
});


test('parseDisplayDate accepts dd.mm.yyyy and rejects impossible calendar dates', () => {
  const parsed = parseDisplayDate('19.01.2025');
  assert.equal(parsed, new Date(2025, 0, 19).getTime());
  assert.equal(parseDisplayDate('31.02.2025'), null);
  assert.equal(parseDisplayDate('2025-01-19'), null);
});
