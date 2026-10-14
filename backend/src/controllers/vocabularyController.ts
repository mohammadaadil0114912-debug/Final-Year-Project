import { Request, Response } from 'express';
import { store } from '../services/store.js';

export const vocabularyController = {
  async getAll(req: Request, res: Response) {
    const { category, search, page = '1', limit = '50' } = req.query;

    let items = Array.from(store.vocabulary.values());

    // Only approved entries for public lookup
    items = items.filter(i => i.reviewStatus === 'approved');

    if (category && typeof category === 'string' && category !== 'all') {
      items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      items = items.filter(i =>
        i.englishTerm.toLowerCase().includes(q) ||
        i.aslGloss.toLowerCase().includes(q) ||
        i.synonyms.some(s => s.toLowerCase().includes(q))
      );
    }

    const p = parseInt(page as string, 10);
    const l = parseInt(limit as string, 10);
    const startIndex = (p - 1) * l;
    const paginated = items.slice(startIndex, startIndex + l);

    return res.json({
      success: true,
      total: items.length,
      page: p,
      limit: l,
      data: paginated
    });
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const item = store.vocabulary.get(id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Vocabulary item not found.' });
    }
    return res.json({
      success: true,
      data: item
    });
  }
};
