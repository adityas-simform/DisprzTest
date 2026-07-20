import request from 'supertest';
import app from '../app';

describe('Users API', () => {
  // ── POST /api/v1/users ──────────────────────────────────────────────────────

  describe('POST /api/v1/users', () => {
    it('creates a user with valid payload', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({ name: 'Alice', email: 'alice@example.com', age: 30 });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({ name: 'Alice', email: 'alice@example.com', age: 30 });
      expect(res.body.data.id).toBeDefined();
    });

    it('returns 422 when required fields are missing', async () => {
      const res = await request(app).post('/api/v1/users').send({});

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toBeDefined();
    });

    it('returns 422 when email is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({ name: 'Bob', email: 'not-an-email', age: 25 });

      expect(res.status).toBe(422);
      expect(res.body.details?.email).toBeDefined();
    });

    it('returns 422 when name is too short', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({ name: 'A', email: 'a@example.com', age: 20 });

      expect(res.status).toBe(422);
      expect(res.body.details?.name).toBeDefined();
    });

    it('returns 409 when email already exists', async () => {
      await request(app)
        .post('/api/v1/users')
        .send({ name: 'Charlie', email: 'charlie@example.com', age: 28 });

      const res = await request(app)
        .post('/api/v1/users')
        .send({ name: 'Charlie2', email: 'charlie@example.com', age: 29 });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  // ── GET /api/v1/users ───────────────────────────────────────────────────────

  describe('GET /api/v1/users', () => {
    it('returns all users', async () => {
      const res = await request(app).get('/api/v1/users');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // ── GET /api/v1/users/:id ───────────────────────────────────────────────────

  describe('GET /api/v1/users/:id', () => {
    it('returns a user by id', async () => {
      const created = await request(app)
        .post('/api/v1/users')
        .send({ name: 'Diana', email: 'diana@example.com', age: 22 });

      const res = await request(app).get(`/api/v1/users/${created.body.data.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('diana@example.com');
    });

    it('returns 404 for unknown id', async () => {
      const res = await request(app).get('/api/v1/users/9999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ── PATCH /api/v1/users/:id ─────────────────────────────────────────────────

  describe('PATCH /api/v1/users/:id', () => {
    it('updates a user', async () => {
      const created = await request(app)
        .post('/api/v1/users')
        .send({ name: 'Eve', email: 'eve@example.com', age: 35 });

      const res = await request(app)
        .patch(`/api/v1/users/${created.body.data.id}`)
        .send({ name: 'Eve Updated' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Eve Updated');
    });

    it('returns 422 when body is empty', async () => {
      const created = await request(app)
        .post('/api/v1/users')
        .send({ name: 'Frank', email: 'frank@example.com', age: 40 });

      const res = await request(app)
        .patch(`/api/v1/users/${created.body.data.id}`)
        .send({});

      expect(res.status).toBe(422);
    });

    it('returns 404 for unknown id', async () => {
      const res = await request(app).patch('/api/v1/users/9999').send({ name: 'Ghost' });

      expect(res.status).toBe(404);
    });
  });

  // ── DELETE /api/v1/users/:id ────────────────────────────────────────────────

  describe('DELETE /api/v1/users/:id', () => {
    it('deletes a user', async () => {
      const created = await request(app)
        .post('/api/v1/users')
        .send({ name: 'Grace', email: 'grace@example.com', age: 27 });

      const res = await request(app).delete(`/api/v1/users/${created.body.data.id}`);
      expect(res.status).toBe(204);
    });

    it('returns 404 for already-deleted or unknown id', async () => {
      const res = await request(app).delete('/api/v1/users/9999');
      expect(res.status).toBe(404);
    });
  });

  // ── Unknown endpoint ────────────────────────────────────────────────────────

  describe('Unknown route', () => {
    it('returns 404 for an undefined endpoint', async () => {
      const res = await request(app).get('/api/v1/unknown');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
