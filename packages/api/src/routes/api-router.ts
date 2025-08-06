// This file demonstrates the auto-import issue with various core functions
// When typing functions from @my-org/my-project-core in this router
// WebStorm should suggest auto-imports but it doesn't work properly

export class ApiRouter {
  private userService: UserService; // UserService should auto-import from core
  private apiClient: ApiClient; // ApiClient should auto-import from core

  constructor() {
    this.userService = new UserService();
    this.apiClient = new ApiClient('https://api.example.com');
  }

  setupRoutes(app: any) {
    // User routes
    app.get('/users', this.getAllUsers.bind(this));
    app.get('/users/:id', this.getUser.bind(this));
    app.post('/users', this.createUser.bind(this));
    app.put('/users/:id', this.updateUser.bind(this));

    // Utility routes
    app.post('/validate-email', this.validateEmailEndpoint.bind(this));
    app.get('/generate-id', this.generateIdEndpoint.bind(this));
  }

  async getAllUsers(req: any, res: any) {
    try {
      const result = await this.userService.getAllUsers();

      if (!result.success) {
        return res.status(500).json(result);
      }

      // Format all users using core utility functions
      const formattedUsers = result.data?.map((user: User) => ({ // User type should auto-import
        id: user.id,
        name: capitalize(user.name), // capitalize should auto-import from core
        email: user.email,
        createdAt: formatDate(user.createdAt), // formatDate should auto-import
        isActive: user.isActive
      }));

      return res.json({
        success: true,
        data: formattedUsers
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch users'
      });
    }
  }

  async getUser(req: any, res: any) {
    const { id } = req.params;

    const result = await this.userService.getUserById(id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.json(result);
  }

  async createUser(req: any, res: any) {
    const { name, email } = req.body;

    // validateEmail should auto-import from core
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const createRequest: CreateUserRequest = { // CreateUserRequest should auto-import
      name: capitalize(name), // capitalize should auto-import
      email
    };

    const result = await this.userService.createUser(createRequest);

    return res.status(result.success ? 201 : 400).json(result);
  }

  async updateUser(req: any, res: any) {
    const { id } = req.params;
    const updateData: UpdateUserRequest = req.body; // UpdateUserRequest should auto-import

    if (updateData.email && !validateEmail(updateData.email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    if (updateData.name) {
      updateData.name = capitalize(updateData.name); // capitalize should auto-import
    }

    const result = await this.userService.updateUser(id, updateData);

    return res.status(result.success ? 200 : 400).json(result);
  }

  async validateEmailEndpoint(req: any, res: any) {
    const { email } = req.body;

    const isValid = validateEmail(email); // validateEmail should auto-import

    const response: ApiResponse<boolean> = { // ApiResponse should auto-import
      success: true,
      data: isValid,
      message: isValid ? 'Email is valid' : 'Email is invalid'
    };

    return res.json(response);
  }

  async generateIdEndpoint(req: any, res: any) {
    const id = generateId(); // generateId should auto-import from core

    const response: ApiResponse<string> = { // ApiResponse should auto-import
      success: true,
      data: id,
      message: 'ID generated successfully'
    };

    return res.json(response);
  }
}
