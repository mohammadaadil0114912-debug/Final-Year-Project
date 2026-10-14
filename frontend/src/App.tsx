import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TextToSignPage } from './pages/TextToSignPage';
import { SpeechToSignPage } from './pages/SpeechToSignPage';
import { ImageToSignPage } from './pages/ImageToSignPage';
import { ConversationPage } from './pages/ConversationPage';
import { PhrasesPage } from './pages/PhrasesPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { ResearchPage } from './pages/ResearchPage';
import { AdminVocabularyPage } from './pages/AdminVocabularyPage';
import { PrivacyPage } from './pages/PrivacyPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 mins
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-brand-900 dark:text-slate-100 transition-colors">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/text-to-sign" element={<TextToSignPage />} />
                  <Route path="/speech-to-sign" element={<SpeechToSignPage />} />
                  <Route path="/image-to-sign" element={<ImageToSignPage />} />
                  <Route path="/conversation" element={<ConversationPage />} />
                  <Route path="/phrases" element={<PhrasesPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/research" element={<ResearchPage />} />
                  <Route path="/admin" element={<AdminVocabularyPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
};

export default App;
