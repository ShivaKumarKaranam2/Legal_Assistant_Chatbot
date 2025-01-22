import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Shield, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark:bg-gray-900 dark:text-white' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Scale className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">LegalAI Assistant</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-8">Your AI Legal Assistant</h1>
          <p className="text-xl mb-12 text-gray-600 dark:text-gray-300">
            Get instant legal insights and answers to your legal questions powered by advanced AI technology.
          </p>

          <button
            onClick={() => navigate('/auth')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Get Started
          </button>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure & Confidential</h3>
              <p className="text-gray-600 dark:text-gray-400">Your conversations are encrypted and completely private</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <Scale className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Legal Expertise</h3>
              <p className="text-gray-600 dark:text-gray-400">Powered by comprehensive legal knowledge base</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Availability</h3>
              <p className="text-gray-600 dark:text-gray-400">Get answers to your legal questions anytime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}