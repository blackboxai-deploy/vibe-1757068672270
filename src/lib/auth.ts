// Authentication utilities for EduAI Platform
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { User, UserRole } from '@/types';

// Mock user database (in production, this would be a real database)
interface StoredUser {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory user storage (replace with real database)
const users: Map<string, StoredUser> = new Map();

// Default admin user for demo
const defaultAdmin: StoredUser = {
  id: 'admin-1',
  email: 'admin@eduai.com',
  password: bcrypt.hashSync('admin123', 12),
  name: 'Admin User',
  role: 'admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Default professor user for demo
const defaultProfessor: StoredUser = {
  id: 'prof-1',
  email: 'professor@eduai.com',
  password: bcrypt.hashSync('prof123', 12),
  name: 'Professor Smith',
  role: 'professor',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Default student user for demo
const defaultStudent: StoredUser = {
  id: 'student-1',
  email: 'student@eduai.com',
  password: bcrypt.hashSync('student123', 12),
  name: 'John Student',
  role: 'student',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Initialize demo users
users.set(defaultAdmin.email, defaultAdmin);
users.set(defaultProfessor.email, defaultProfessor);
users.set(defaultStudent.email, defaultStudent);

// JWT configuration
const JWT_SECRET = typeof window === 'undefined' 
  ? process.env.JWT_SECRET || 'your-super-secure-jwt-secret-development-only'
  : 'your-super-secure-jwt-secret-development-only';
const JWT_EXPIRES_IN = '7d';

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export class AuthService {
  // Register new user
  static async register(
    email: string,
    password: string,
    name: string,
    role: UserRole = 'student'
  ): Promise<AuthResult> {
    try {
      // Check if user already exists
      if (users.has(email)) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      // Validate input
      if (!email || !password || !name) {
        return {
          success: false,
          error: 'All fields are required'
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters long'
        };
      }

      // Create user
      const hashedPassword = await bcrypt.hash(password, 12);
      const userId = `${role}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const storedUser: StoredUser = {
        id: userId,
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      users.set(email.toLowerCase(), storedUser);

      // Create public user object (without password)
      const user: User = {
        id: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
        role: storedUser.role,
        avatar: storedUser.avatar,
        createdAt: storedUser.createdAt,
        updatedAt: storedUser.updatedAt,
      };

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    }
  }

  // Login user
  static async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Validate input
      if (!email || !password) {
        return {
          success: false,
          error: 'Email and password are required'
        };
      }

      // Find user
      const storedUser = users.get(email.toLowerCase());
      if (!storedUser) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, storedUser.password);
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Create public user object
      const user: User = {
        id: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
        role: storedUser.role,
        avatar: storedUser.avatar,
        createdAt: storedUser.createdAt,
        updatedAt: storedUser.updatedAt,
      };

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    }
  }

  // Verify JWT token
  static async verifyToken(token: string): Promise<AuthResult> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        role: UserRole;
      };

      // Find user
      const storedUser = users.get(decoded.email.toLowerCase());
      if (!storedUser) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Create public user object
      const user: User = {
        id: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
        role: storedUser.role,
        avatar: storedUser.avatar,
        createdAt: storedUser.createdAt,
        updatedAt: storedUser.updatedAt,
      };

      return {
        success: true,
        user,
        token,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid or expired token'
      };
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      for (const storedUser of users.values()) {
        if (storedUser.id === userId) {
          return {
            id: storedUser.id,
            email: storedUser.email,
            name: storedUser.name,
            role: storedUser.role,
            avatar: storedUser.avatar,
            createdAt: storedUser.createdAt,
            updatedAt: storedUser.updatedAt,
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Update user profile
  static async updateUser(
    userId: string,
    updates: Partial<Pick<User, 'name' | 'avatar'>>
  ): Promise<AuthResult> {
    try {
      // Find user
      let targetUser: StoredUser | null = null;
      for (const storedUser of users.values()) {
        if (storedUser.id === userId) {
          targetUser = storedUser;
          break;
        }
      }

      if (!targetUser) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Update user
      if (updates.name) targetUser.name = updates.name;
      if (updates.avatar !== undefined) targetUser.avatar = updates.avatar;
      targetUser.updatedAt = new Date().toISOString();

      // Update in storage
      users.set(targetUser.email, targetUser);

      // Return updated user
      const user: User = {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        role: targetUser.role,
        avatar: targetUser.avatar,
        createdAt: targetUser.createdAt,
        updatedAt: targetUser.updatedAt,
      };

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: 'Failed to update user profile',
      };
    }
  }

  // Get all users (admin only)
  static async getAllUsers(): Promise<User[]> {
    try {
      return Array.from(users.values()).map(storedUser => ({
        id: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
        role: storedUser.role,
        avatar: storedUser.avatar,
        createdAt: storedUser.createdAt,
        updatedAt: storedUser.updatedAt,
      }));
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  }

  // Change password
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<AuthResult> {
    try {
      // Find user
      let targetUser: StoredUser | null = null;
      for (const storedUser of users.values()) {
        if (storedUser.id === userId) {
          targetUser = storedUser;
          break;
        }
      }

      if (!targetUser) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, targetUser.password);
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Current password is incorrect'
        };
      }

      // Validate new password
      if (newPassword.length < 6) {
        return {
          success: false,
          error: 'New password must be at least 6 characters long'
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      targetUser.password = hashedPassword;
      targetUser.updatedAt = new Date().toISOString();

      // Update in storage
      users.set(targetUser.email, targetUser);

      return {
        success: true,
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: 'Failed to change password',
      };
    }
  }
}

// Middleware for API route protection
export const requireAuth = (handler: any) => {
  return async (req: any, res: any) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const authResult = await AuthService.verifyToken(token);
      
      if (!authResult.success) {
        return res.status(401).json({ error: authResult.error });
      }

      req.user = authResult.user;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };
};

// Middleware for role-based access
export const requireRole = (roles: UserRole[]) => {
  return (handler: any) => {
    return requireAuth(async (req: any, res: any) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      return handler(req, res);
    });
  };
};

// Demo credentials for testing
export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@eduai.com', password: 'admin123' },
  professor: { email: 'professor@eduai.com', password: 'prof123' },
  student: { email: 'student@eduai.com', password: 'student123' },
};