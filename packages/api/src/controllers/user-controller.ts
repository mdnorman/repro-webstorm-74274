// This file demonstrates the auto-import issue
// When typing functions like validateEmail, UserService, etc. from @my-org/my-project-core
// WebStorm should suggest auto-imports but it doesn't work properly

// other imports from this file will work
import { validateEmail } from "@my-org/my-project-core/utils";

export class UserController {
  private userService: UserService; // This should auto-import UserService from core

  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: any, res: any) {
    const { name, email } = req.body;

    // These functions should be auto-imported from @my-org/my-project-core
    if (!validateEmail(email)) { // validateEmail should auto-import
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    const result = await this.userService.createUser({ name, email });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  }

  async getUser(req: any, res: any) {
    const { id } = req.params;

    const result = await this.userService.getUserById(id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.json(result);
  }

  async updateUser(req: any, res: any) {
    const { id } = req.params;
    const updateData = req.body;

    // This function should also auto-import from core
    if (updateData.email && !validateEmail(updateData.email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    const result = await this.userService.updateUser(id, updateData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  }

  async formatUserResponse(user: User): Promise<any> { // User type should auto-import
    return {
      id: user.id,
      name: capitalize(user.name), // capitalize should auto-import from core
      email: user.email,
      createdAt: formatDate(user.createdAt), // formatDate should auto-import
      isActive: user.isActive
    };
  }
}
