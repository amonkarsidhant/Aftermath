const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createShareToken } = require('../dist/routes/share.js');
const { verifyShareToken } = require('../dist/middleware/shareAuth.js');

process.env.JWT_SECRET = 'test-secret';

test('share token creation and validation', () => {
  const token = createShareToken('incident', '42');
  const payload = verifyShareToken(token);
  assert.equal(payload.type, 'incident');
  assert.equal(payload.id, '42');
});
