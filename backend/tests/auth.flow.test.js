// End-to-end auth flow test (in-memory Mongo, no external services).
process.env.JWT_SECRET = 'test-access';
process.env.OTP_PEPPER = 'test-pepper';
process.env.NODE_ENV = 'test';
process.env.FRONTEND_URL = 'http://localhost:5173';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');

let lastOtp = null;
const origLog = console.log;
console.log = (...args) => { const m = (args.join(' ').match(/code is (\d{6})/)); if (m) lastOtp = m[1]; };

(async () => {
  const mem = await MongoMemoryServer.create();
  process.env.MONGO_URI = mem.getUri();
  await mongoose.connect(process.env.MONGO_URI);
  const app = require('../server');
  const agent = request.agent(app);
  const fail = (m) => { origLog('❌ ' + m); process.exit(1); };
  const ok = (m) => origLog('✅ ' + m);

  let r = await agent.post('/api/auth/register').send({ username: 'jane-doe', email: 'jane@example.com', password: 'StrongP@ss1' });
  if (r.status !== 201 || !r.body.requiresVerification) fail('register ' + r.status);
  if (!lastOtp) fail('no OTP captured');
  ok('register issues OTP, no token');

  r = await agent.post('/api/auth/login').send({ identifier: 'jane@example.com', password: 'StrongP@ss1' });
  if (r.status !== 403) fail('login before verify should be 403');
  ok('login blocked until verified');

  r = await agent.post('/api/auth/verify-email').send({ email: 'jane@example.com', code: '000000' });
  if (r.status !== 400) fail('wrong OTP should be 400');
  ok('wrong OTP rejected');

  r = await agent.post('/api/auth/verify-email').send({ email: 'jane@example.com', code: lastOtp });
  if (r.status !== 200 || !r.body.token) fail('verify failed');
  if (!/refreshToken=.*HttpOnly/i.test((r.headers['set-cookie'] || []).join(';'))) fail('refresh cookie not httpOnly');
  ok('verify activates + httpOnly refresh cookie');

  r = await agent.get('/api/auth/verify').set('Authorization', `Bearer ${r.body.token}`);
  if (r.status !== 200) fail('protected route failed');
  ok('access token authorizes');

  r = await agent.post('/api/auth/refresh');
  if (r.status !== 200 || !r.body.token) fail('refresh failed');
  ok('refresh rotates token');

  r = await agent.post('/api/auth/login').send({ identifier: 'jane-doe', password: 'StrongP@ss1', remember: true });
  if (r.status !== 200) fail('login failed');
  ok('verified login works');

  r = await agent.post('/api/auth/register').send({ username: 'bob-x', email: 'bob@example.com', password: 'weak' });
  if (r.status !== 400) fail('weak password should be 400');
  ok('weak password rejected');

  lastOtp = null;
  await agent.post('/api/auth/forgot-password').send({ email: 'jane@example.com' });
  if (!lastOtp) fail('no reset OTP');
  r = await agent.post('/api/auth/verify-reset-otp').send({ email: 'jane@example.com', code: lastOtp });
  if (r.status !== 200 || !r.body.resetToken) fail('reset OTP verify failed');
  r = await agent.post('/api/auth/reset-password').send({ resetToken: r.body.resetToken, password: 'NewStr0ng@1' });
  if (r.status !== 200 || !r.body.token) fail('reset failed');
  ok('forgot → reset → auto-login');

  r = await agent.post('/api/auth/login').send({ identifier: 'jane@example.com', password: 'NewStr0ng@1' });
  if (r.status !== 200) fail('new password login failed');
  ok('new password works');

  origLog('\n🎉 AUTH FLOW: ALL CHECKS PASSED');
  await mongoose.disconnect(); await mem.stop(); process.exit(0);
})().catch((e) => { origLog('❌', e); process.exit(1); });
