import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { store } from '../services/store.js';
import { ISavedPhrase } from '../models/types.js';

export const phraseController = {
  async getPhrases(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    // Return system emergency presets + user's saved phrases
    const allPhrases = Array.from(store.phrases.values());
    const filtered = allPhrases.filter(p => !userId || p.userId === userId || p.userId === 'user-demo-001');

    return res.json({
      success: true,
      total: filtered.length,
      data: filtered
    });
  },

  async createPhrase(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required to save phrases.' });
    }

    const { englishText, aslGloss, category, isFavorite } = req.body;
    if (!englishText || !aslGloss) {
      return res.status(400).json({ success: false, error: 'English text and ASL gloss are required.' });
    }

    const id = `phrase-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newPhrase: ISavedPhrase = {
      id,
      userId: req.user.id,
      englishText: englishText.trim(),
      aslGloss: aslGloss.trim(),
      category: category || 'custom',
      isFavorite: isFavorite ?? false,
      createdAt: new Date().toISOString()
    };

    store.phrases.set(id, newPhrase);
    return res.status(201).json({ success: true, data: newPhrase });
  },

  async deletePhrase(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    const { id } = req.params;
    const phrase = store.phrases.get(id);
    if (!phrase) {
      return res.status(404).json({ success: false, error: 'Phrase not found.' });
    }

    if (phrase.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized to delete this phrase.' });
    }

    store.phrases.delete(id);
    return res.json({ success: true, message: 'Phrase removed.' });
  }
};
