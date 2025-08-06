// This file demonstrates the auto-import issue with ApiClient and other core functions
// When typing ApiClient, generateId, etc. from @my-org/my-project-core
// WebStorm should suggest auto-imports but it doesn't work properly

export class AuthMiddleware {
  private apiClient: ApiClient; // This should auto-import ApiClient from core

  constructor(baseUrl: string) {
    this.apiClient = new ApiClient(baseUrl); // ApiClient should auto-import
  }

  async authenticate(req: any, res: any, next: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    try {
      // Using ApiClient from core package - should auto-import
      const result = await this.apiClient.get('/auth/verify', {
        'Authorization': `Bearer ${token}`
      });

      if (!result.success) {
        return res.status(401).json(result);
      }

      req.user = result.data;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Authentication failed'
      });
    }
  }

  async generateApiKey(userId: string): Promise<ApiResponse<string>> { // ApiResponse should auto-import
    const apiKey = `api_${generateId()}_${userId}`; // generateId should auto-import from core

    // Store the API key using ApiClient
    const result = await this.apiClient.post('/api-keys', {
      userId,
      apiKey,
      createdAt: new Date()
    });

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to generate API key'
      };
    }

    return {
      success: true,
      data: apiKey,
      message: 'API key generated successfully'
    };
  }

  validateApiKey(req: any, res: any, next: any) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key required'
      });
    }

    // Simple validation - in real app this would check against database
    if (!apiKey.startsWith('api_')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key format'
      });
    }

    next();
  }
}
