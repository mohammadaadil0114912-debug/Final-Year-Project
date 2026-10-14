import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../services/store.js';
import { config } from '../config/index.js';
import { AuthRequest } from '../middleware/auth.js';
import { IUser } from '../models/types.js';

export const authController = {
  async register(req: Request, res: Response) {
    const { email, password, name, preferredMode } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Email, password, and name are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    // Check if user exists
    const existing = Array.from(store.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(config.bcryptRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: IUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name.trim(),
      role: 'user',
      preferredMode: preferredMode || 'text',
      historyRetentionEnabled: true,
      contrastTheme: 'standard',
      largeText: false,
      createdAt: new Date().toISOString()
    };

    store.users.set(newUser.id, newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({
      success: true,
      token,
      user: safeUser
    });
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = Array.from(store.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      success: true,
      token,
      user: safeUser
    });
  },

  async getMe(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated.' });
    }

    const user = store.users.get(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      success: true,
      user: safeUser
    });
  },

  async updatePreferences(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated.' });
    }

    const user = store.users.get(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found.' });
    }

    const { preferredMode, historyRetentionEnabled, contrastTheme, largeText, name } = req.body;
    if (preferredMode !== undefined) user.preferredMode = preferredMode;
    if (historyRetentionEnabled !== undefined) user.historyRetentionEnabled = historyRetentionEnabled;
    if (contrastTheme !== undefined) user.contrastTheme = contrastTheme;
    if (largeText !== undefined) user.largeText = largeText;
    if (name !== undefined) user.name = name;

    store.users.set(user.id, user);

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      success: true,
      user: safeUser
    });
  }
};
