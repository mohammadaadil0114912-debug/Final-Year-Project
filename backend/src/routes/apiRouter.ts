import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { translationController } from '../controllers/translationController.js';
import { vocabularyController } from '../controllers/vocabularyController.js';
import { phraseController } from '../controllers/phraseController.js';
import { historyController } from '../controllers/historyController.js';
import { feedbackController } from '../controllers/feedbackController.js';
import { adminController } from '../controllers/adminController.js';
import { researchController } from '../controllers/researchController.js';
import { authenticateToken, optionalToken, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { aiClient } from '../services/aiClient.js';
import { isMongoConnected } from '../config/db.js';

const router = Router();

// Health check
router.get('/health', async (req, res) => {
  const aiHealth = await aiClient.checkHealth();
  return res.json({
    status: 'ok',
    service: 'asl-bridge-backend',
    timestamp: new Date().toISOString(),
    database: isMongoConnected ? 'connected' : 'in-memory fallback active',
    aiService: aiHealth.status === 'healthy' ? 'reachable' : 'unreachable'
  });
});

// Authentication routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken, authController.getMe);
router.patch('/auth/preferences', authenticateToken, authController.updatePreferences);

// Translation routes
router.post('/translate/text', optionalToken, translationController.translateText);
router.post('/translate/speech', optionalToken, translationController.translateSpeech);
router.post('/translate/image', upload.single('image'), optionalToken, translationController.translateImage);

// Vocabulary routes (public)
router.get('/vocabulary', vocabularyController.getAll);
router.get('/vocabulary/:id', vocabularyController.getById);

// Saved and emergency phrases
router.get('/phrases', optionalToken, phraseController.getPhrases);
router.post('/phrases', authenticateToken, phraseController.createPhrase);
router.delete('/phrases/:id', authenticateToken, phraseController.deletePhrase);

// History routes
router.get('/history', authenticateToken, historyController.getHistory);
router.delete('/history/:id', authenticateToken, historyController.deleteItem);
router.delete('/history', authenticateToken, historyController.clearHistory);

// Feedback routes
router.post('/feedback', optionalToken, feedbackController.submitFeedback);
router.get('/feedback', authenticateToken, requireAdmin, feedbackController.getFeedback);

// Admin vocabulary routes
router.get('/admin/vocabulary', authenticateToken, requireAdmin, adminController.getVocabulary);
router.post('/admin/vocabulary', authenticateToken, requireAdmin, adminController.createVocabulary);
router.patch('/admin/vocabulary/:id', authenticateToken, requireAdmin, adminController.updateVocabulary);
router.post('/admin/vocabulary/:id/review', authenticateToken, requireAdmin, adminController.reviewVocabulary);

// Research & evaluation routes
router.get('/research/evaluation', researchController.getEvaluation);

export default router;
