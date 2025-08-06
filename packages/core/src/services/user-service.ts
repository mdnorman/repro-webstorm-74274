import { User, CreateUserRequest, UpdateUserRequest, ApiResponse } from '../types';
import { validateEmail, generateId } from '../utils';

export class UserService {
  private users: User[] = [];

  /**
   * Creates a new user
   */
  async createUser(request: CreateUserRequest): Promise<ApiResponse<User>> {
    if (!validateEmail(request.email)) {
      return {
        success: false,
        error: 'Invalid email address'
      };
    }

    const existingUser = this.users.find(u => u.email === request.email);
    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists'
      };
    }

    const newUser: User = {
      id: generateId(),
      name: request.name,
      email: request.email,
      createdAt: new Date(),
      isActive: true
    };

    this.users.push(newUser);

    return {
      success: true,
      data: newUser,
      message: 'User created successfully'
    };
  }

  /**
   * Gets a user by ID
   */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    const user = this.users.find(u => u.id === id);

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    return {
      success: true,
      data: user
    };
  }

  /**
   * Updates an existing user
   */
  async updateUser(id: string, request: UpdateUserRequest): Promise<ApiResponse<User>> {
    const userIndex = this.users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    if (request.email && !validateEmail(request.email)) {
      return {
        success: false,
        error: 'Invalid email address'
      };
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...request
    };

    this.users[userIndex] = updatedUser;

    return {
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    };
  }

  /**
   * Gets all users
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return {
      success: true,
      data: this.users
    };
  }
}
