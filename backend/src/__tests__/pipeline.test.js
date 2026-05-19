const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const database = require('../db/database');

jest.mock('../db/database', () => ({
  pipelineDB: {
    findFiltered: jest.fn(),
    findByRunId: jest.fn(),
    getHealth: jest.fn(),
    delete: jest.fn(),
    deleteAll: jest.fn()
  }
}));

jest.mock('../services/githubAuth.service', () => ({
  verifyDevPulseJWT: jest.fn()
}));
const githubAuthService = require('../services/githubAuth.service');

describe('Pipeline Routes', () => {
  let mockToken;

  beforeAll(() => {
    mockToken = jwt.sign({ sub: '123', username: 'testuser' }, config.jwtSecret);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    githubAuthService.verifyDevPulseJWT.mockReturnValue({ sub: '123', username: 'testuser' });
  });

  describe('GET /api/pipeline/results', () => {


    it('should return pipeline results', async () => {
      database.pipelineDB.findFiltered.mockReturnValue([{ id: 'run1', repository: 'owner/repo' }]);
      
      const res = await request(app)
        .get('/api/pipeline/results')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.results).toHaveLength(1);
    });
  });

  describe('GET /api/pipeline/health', () => {
    it('should return health status', async () => {
      database.pipelineDB.getHealth.mockReturnValue({ total: 10, successes: 8, avgScore: 85, latest: null });
      
      const res = await request(app).get('/api/pipeline/health');

      expect(res.status).toBe(200);
      expect(res.body.totalRuns).toBe(10);
    });
  });
});
