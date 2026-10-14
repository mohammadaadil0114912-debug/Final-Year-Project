import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { store } from '../services/store.js';

export const historyController = {
  async getHistory(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required to access history.' });
    }

    const { page = '1', limit = '20' } = req.query;
    const allHistory = Array.from(store.history.values())
      .filter(h => h.userId === req.user!.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const p = parseInt(page as string, 10);
    const l = parseInt(limit as string, 10);
    const startIndex = (p - 1) * l;
    const paginated = allHistory.slice(startIndex, startIndex + l);

    return res.json({
      success: true,
      total: allHistory.length,
      page: p,
      limit: l,
      data: paginated
    });
  },

  async deleteItem(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    const { id } = req.params;
    const item = store.history.get(id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'History item not found.' });
    }

    if (item.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized.' });
    }

    store.history.delete(id);
    return res.json({ success: true, message: 'History record deleted.' });
  },

  async clearHistory(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required.' });
    }

    let deletedCount = 0;
    for (const [id, item] of store.history.entries()) {
      if (item.userId === req.user.id) {
        store.history.delete(id);
        deletedCount++;
      }
    }

    return res.json({ success: true, message: `Purged ${deletedCount} history entries.` });
  }
};
