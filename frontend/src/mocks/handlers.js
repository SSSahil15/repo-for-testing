import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:4000/auth/me', () => {
    return HttpResponse.json({
      authenticated: true,
      user: {
        id: '123',
        username: 'testuser',
        avatarUrl: 'https://example.com/avatar.png'
      }
    });
  }),
  
  http.get('http://localhost:4000/repos', () => {
    return HttpResponse.json([
      { id: '1', full_name: 'owner/repo1', description: 'Test Repo 1' },
      { id: '2', full_name: 'owner/repo2', description: 'Test Repo 2' }
    ]);
  }),

  http.post('http://localhost:4000/analyze', () => {
    return HttpResponse.json({
      success: true,
      data: {
        jobId: 'job_123',
        status: 'queued'
      }
    });
  })
];
