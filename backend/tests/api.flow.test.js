// Analytics + contact + AI assistant integration test (in-memory Mongo).
process.env.JWT_SECRET = 'test-access';
process.env.OTP_PEPPER = 'test-pepper';
process.env.NODE_ENV = 'test';
process.env.FRONTEND_URL = 'https://portfolio-project-prathip.vercel.app';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');

let lastOtp = null;
const orig = console.log;
console.log = (...a) => { const s = a.join(' '); const m = s.match(/(\d{6})/); if (m && s.toLowerCase().includes('code')) lastOtp = m[1]; };

(async () => {
  const mem = await MongoMemoryServer.create();
  process.env.MONGO_URI = mem.getUri();
  await mongoose.connect(process.env.MONGO_URI);
  const app = require('../server');
  const agent = request.agent(app);
  const ok = (m) => orig('✅ ' + m);
  const fail = (m) => { orig('❌ ' + m); process.exit(1); };

  let r = await agent.post('/api/auth/register').send({ username: 'jane-doe', email: 'jane@x.com', password: 'StrongP@ss1' });
  r = await agent.post('/api/auth/verify-email').send({ email: 'jane@x.com', code: lastOtp });
  const token = r.body.token;
  ok('user verified');

  r = await agent.put('/api/profile/me').set('Authorization', `Bearer ${token}`)
    .field('name', 'Jane Doe').field('title', 'Full-Stack Developer').field('about', 'I build web apps.').field('email', 'jane@x.com');
  if (r.status !== 200) fail('profile ' + r.status);
  ok('profile created');

  await agent.post('/api/portfolio/jane-doe/visit').send({ path: '/' });
  await agent.post('/api/portfolio/jane-doe/theme').send({ theme: 'cyberpunk' });
  await agent.post('/api/portfolio/jane-doe/resume-download').send({});
  ok('visit/theme/resume tracked');

  r = await agent.post('/api/portfolio/jane-doe/contact').send({ name: 'Recruiter', email: 'r@co.com', message: 'We have a role for you!' });
  if (r.status !== 201) fail('contact ' + r.status);
  ok('contact submitted');

  r = await agent.post('/api/portfolio/jane-doe/assistant').send({ message: 'What are their skills?' });
  if (r.status !== 200 || !r.body.reply) fail('assistant ' + r.status);
  ok('assistant replies (' + r.body.mode + ' mode)');

  r = await agent.get('/api/portfolio/me/analytics').set('Authorization', `Bearer ${token}`);
  if (r.status !== 200 || r.body.visits.total < 1 || r.body.messages.total < 1) fail('analytics ' + r.status);
  ok(`analytics OK (visits=${r.body.visits.total}, msgs=${r.body.messages.total}, themes=${r.body.themes.length})`);

  orig('\n🎉 API (analytics/contact/assistant): ALL CHECKS PASSED');
  await mongoose.disconnect(); await mem.stop(); process.exit(0);
})().catch((e) => { orig('❌', e); process.exit(1); });
