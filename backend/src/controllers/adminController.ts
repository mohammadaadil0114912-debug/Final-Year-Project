import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { store } from '../services/store.js';
import { IVocabularyItem } from '../models/types.js';

export const adminController = {
  async getVocabulary(req: AuthRequest, res: Response) {
    const { status, category, search, page = '1', limit = '50' } = req.query;

    let items = Array.from(store.vocabulary.values());

    if (status && typeof status === 'string' && status !== 'all') {
      items = items.filter(i => i.reviewStatus === status);
    }

    if (category && typeof category === 'string' && category !== 'all') {
      items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      items = items.filter(i =>
        i.englishTerm.toLowerCase().includes(q) ||
        i.aslGloss.toLowerCase().includes(q)
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

  async createVocabulary(req: AuthRequest, res: Response) {
    const { englishTerm, aslGloss, category, definition, synonyms, media, nonManualSignal } = req.body;

    if (!englishTerm || !aslGloss) {
      return res.status(400).json({ success: false, error: 'English term and ASL gloss are required.' });
    }

    const id = `vocab-${englishTerm.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`;
    const newEntry: IVocabularyItem = {
      id,
      englishTerm: englishTerm.trim().toLowerCase(),
      aslGloss: aslGloss.trim().toUpperCase(),
      category: category || 'general',
      definition: definition ? definition.trim() : '',
      synonyms: Array.isArray(synonyms) ? synonyms : [],
      media: {
        type: media?.type || 'video',
        url: media?.url || '',
        fallbackImage: media?.fallbackImage,
        thumbnailUrl: media?.thumbnailUrl,
        source: media?.source || 'Admin Upload / Verified Reference',
        license: media?.license || 'CC BY-NC-SA 4.0',
        verified: true
      },
      nonManualSignal: nonManualSignal || 'neutral',
      reviewStatus: 'approved',
      reviewer: req.user?.name || 'Administrator',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.vocabulary.set(id, newEntry);
    return res.status(201).json({ success: true, data: newEntry });
  },

  async updateVocabulary(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const entry = store.vocabulary.get(id);
    if (!entry) {
      return res.status(404).json({ success: false, error: 'Vocabulary entry not found.' });
    }

    const { englishTerm, aslGloss, category, definition, synonyms, media, nonManualSignal } = req.body;
    if (englishTerm !== undefined) entry.englishTerm = englishTerm;
    if (aslGloss !== undefined) entry.aslGloss = aslGloss.toUpperCase();
    if (category !== undefined) entry.category = category;
    if (definition !== undefined) entry.definition = definition;
    if (synonyms !== undefined) entry.synonyms = synonyms;
    if (media !== undefined) entry.media = { ...entry.media, ...media };
    if (nonManualSignal !== undefined) entry.nonManualSignal = nonManualSignal;
    entry.updatedAt = new Date().toISOString();

    store.vocabulary.set(id, entry);
    return res.json({ success: true, data: entry });
  },

  async reviewVocabulary(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { status, notes } = req.body;

    const entry = store.vocabulary.get(id);
    if (!entry) {
      return res.status(404).json({ success: false, error: 'Vocabulary entry not found.' });
    }

    if (!['approved', 'flagged', 'deprecated', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid review status.' });
    }

    entry.reviewStatus = status;
    entry.reviewer = req.user?.name || 'Administrator';
    entry.updatedAt = new Date().toISOString();

    store.vocabulary.set(id, entry);
    return res.json({ success: true, message: `Status updated to ${status}.`, data: entry });
  }
};
