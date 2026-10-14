import { Request, Response } from 'express';
import { aiClient } from '../services/aiClient.js';
import { store } from '../services/store.js';
import { AuthRequest } from '../middleware/auth.js';
import { ITranslationHistory } from '../models/types.js';

export const translationController = {
  async translateText(req: AuthRequest, res: Response) {
    try {
      const { text, strategy } = req.body;
      if (!text || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ success: false, error: 'Text input must not be empty.' });
      }

      const result = await aiClient.translateText(text.trim(), strategy || 'rag_grounded');

      // Record in history if user is authenticated and opted in
      if (req.user) {
        const user = store.users.get(req.user.id);
        if (user && user.historyRetentionEnabled) {
          const historyItem: ITranslationHistory = {
            id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            userId: req.user.id,
            inputType: 'text',
            inputText: text.trim(),
            strategy: result.processing_method,
            aslGloss: result.asl_gloss,
            signsCount: result.signs ? result.signs.length : 0,
            coverage: result.confidence?.vocabulary_coverage ?? 1.0,
            overallLabel: result.confidence?.overall_label ?? 'Processed',
            durationMs: result.duration_ms ?? 0,
            createdAt: new Date().toISOString()
          };
          store.history.set(historyItem.id, historyItem);
        }
      }

      return res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      console.error('[Translation API Error]', err.message);
      return res.status(502).json({
        success: false,
        error: 'AI translation microservice unavailable or processing failed.',
        details: err.message
      });
    }
  },

  async translateSpeech(req: AuthRequest, res: Response) {
    try {
      const { transcript, audioConfidence, strategy } = req.body;
      if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
        return res.status(400).json({ success: false, error: 'Speech transcript must not be empty.' });
      }

      const result = await aiClient.translateTranscript(
        transcript.trim(),
        audioConfidence,
        strategy || 'rag_grounded'
      );

      if (req.user) {
        const user = store.users.get(req.user.id);
        if (user && user.historyRetentionEnabled) {
          const historyItem: ITranslationHistory = {
            id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            userId: req.user.id,
            inputType: 'speech',
            inputText: transcript.trim(),
            strategy: result.processing_method,
            aslGloss: result.asl_gloss,
            signsCount: result.signs ? result.signs.length : 0,
            coverage: result.confidence?.vocabulary_coverage ?? 1.0,
            overallLabel: result.confidence?.overall_label ?? 'Processed',
            durationMs: result.duration_ms ?? 0,
            createdAt: new Date().toISOString()
          };
          store.history.set(historyItem.id, historyItem);
        }
      }

      return res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      console.error('[Speech Translation Error]', err.message);
      return res.status(502).json({
        success: false,
        error: 'Failed to process speech transcript.',
        details: err.message
      });
    }
  },

  async translateImage(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No image file uploaded.' });
      }

      const strategy = (req.body.strategy as string) || 'rag_grounded';
      const result = await aiClient.translateImage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        strategy
      );

      if (req.user && result.translation) {
        const user = store.users.get(req.user.id);
        if (user && user.historyRetentionEnabled) {
          const historyItem: ITranslationHistory = {
            id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            userId: req.user.id,
            inputType: 'image',
            inputText: result.ocr_result?.extracted_text || 'Image text',
            strategy: result.translation.processing_method,
            aslGloss: result.translation.asl_gloss,
            signsCount: result.translation.signs ? result.translation.signs.length : 0,
            coverage: result.translation.confidence?.vocabulary_coverage ?? 1.0,
            overallLabel: result.translation.confidence?.overall_label ?? 'OCR Translated',
            durationMs: result.translation.duration_ms ?? 0,
            createdAt: new Date().toISOString()
          };
          store.history.set(historyItem.id, historyItem);
        }
      }

      return res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      console.error('[Image OCR Translation Error]', err.message);
      return res.status(502).json({
        success: false,
        error: 'Failed to process image OCR or translation.',
        details: err.message
      });
    }
  }
};
