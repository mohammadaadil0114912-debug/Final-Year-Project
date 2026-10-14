import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Mic, 
  Image, 
  MessageSquare, 
  Bookmark, 
  BarChart2, 
  Shield, 
  User, 
  LogOut, 
  Eye, 
  Type, 
  Menu, 
  X,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { highContrast, largeText, toggleHighContrast, toggleLargeText } = useAccessibility();

  const navLinks = [
    { name: 'Text-to-Sign', path: '/text-to-sign', icon: Sparkles },
    { name: 'Speech-to-Sign', path: '/speech-to-sign', icon: Mic },
    { name: 'Image-to-Sign', path: '/image-to-sign', icon: Image },
    { name: 'Conversation', path: '/conversation', icon: MessageSquare },
    { name: 'Quick Phrases', path: '/phrases', icon: Bookmark },
    { name: 'Research Lab', path: '/research', icon: BarChart2 },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-brand-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                ASL Bridge <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-800 dark:text-brand-300 font-semibold border border-brand-200 dark:border-brand-700">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-1 font-medium">Multimodal Sign Platform</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-800/60 dark:text-brand-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-brand-500" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Accessibility Controls & Auth */}
          <div className="hidden md:flex items-center space-x-2">
            {/* High Contrast Toggle */}
            <button
              onClick={toggleHighContrast}
              title="Toggle High Contrast Mode"
              aria-label="Toggle High Contrast"
              className={`p-2 rounded-lg text-sm border transition-colors ${
                highContrast
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Large Text Toggle */}
            <button
              onClick={toggleLargeText}
              title="Toggle Larger Text"
              aria-label="Toggle Large Text"
              className={`p-2 rounded-lg text-sm border transition-colors ${
                largeText
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Admin Link if authorized */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Vocab</span>
              </Link>
            )}

            {/* User Profile or Login */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-200"
                >
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  <span>{user?.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 text-slate-500 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-900 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <link.icon className="w-4 h-4 text-brand-500" />
              <span>{link.name}</span>
            </Link>
          ))}
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <FileText className="w-4 h-4 text-brand-500" />
            <span>About & Methodology</span>
          </Link>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleHighContrast}
                className="px-3 py-1.5 text-xs font-medium border rounded-md"
              >
                Contrast: {highContrast ? 'High' : 'Normal'}
              </button>
              <button
                onClick={toggleLargeText}
                className="px-3 py-1.5 text-xs font-medium border rounded-md"
              >
                Text: {largeText ? 'Large' : 'Normal'}
              </button>
            </div>
            {isAuthenticated ? (
              <button onClick={logout} className="text-xs text-red-500 font-medium">Sign out</button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-xs text-brand-600 font-semibold">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
