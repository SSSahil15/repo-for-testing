const request = require('supertest');
const app = require('../app');
const githubAuthService = require('../services/githubAuth.service');
const providerTokenStoreService = require('../services/providerTokenStore.service');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

jest.mock('../services/githubAuth.service');
jest.mock('../services/providerTokenStore.service');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /auth/github', () => {
    it('should redirect to GitHub OAuth', async () => {
      const res = await request(app).get('/auth/github');
      expect(res.status).toBe(302);
      expect(res.headers.location).toContain('https://github.com/login/oauth/authorize');
    });
  });

  describe('GET /auth/github/callback', () => {
    it('should handle missing code', async () => {
      const res = await request(app).get('/auth/github/callback');
      expect(res.status).toBe(302);
      expect(res.headers.location).toContain('/login?error=github_denied');
    });

    it('should exchange code for token and issue JWT', async () => {
      githubAuthService.exchangeCodeForGitHubToken.mockResolvedValue('mock_github_token');
      githubAuthService.fetchGitHubUser.mockResolvedValue({
        id: 123,
        login: 'testuser',
        avatar_url: 'http://avatar',
        html_url: 'http://html',
      });
      githubAuthService.issueDevPulseJWT.mockReturnValue('mock_jwt_token');
      providerTokenStoreService.saveGitHubProviderToken.mockResolvedValue(true);

      const res = await request(app).get('/auth/github/callback?code=mock_code');
      
      expect(res.status).toBe(302);
      expect(res.headers.location).toContain('/auth/callback?token=mock_jwt_token');
    });
  });

  describe('GET /auth/me', () => {
    it('should return 401 if unauthenticated', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.status).toBe(401);
    });

    it('should return user info if authenticated', async () => {
      const mockToken = jwt.sign({ sub: '123', username: 'testuser' }, config.jwtSecret);
      githubAuthService.verifyDevPulseJWT.mockReturnValue({ sub: '123', username: 'testuser' });
      providerTokenStoreService.getGitHubProviderTokenStatus.mockResolvedValue(true);

      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.status).toBe(200);
      expect(res.body.authenticated).toBe(true);
      expect(res.body.user.username).toBe('testuser');
    });
  });
});
