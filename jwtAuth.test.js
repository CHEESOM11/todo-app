process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const jwtAuth = require('./middleware/jwtAuth');

const app = express();
app.get('/protected', jwtAuth, (req, res) => {
  res.status(200).json({ user: req.user });
});

describe('jwtAuth middleware', () => {
  it('accepts a JWT from a cookie', async () => {
    const token = jwt.sign({ id: '123', username: 'tester' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .get('/protected')
      .set('Cookie', [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.id).toBe('123');
  });
});
