import React, { useState } from 'react';
import { Search, ArrowRight, BarChart2 } from 'lucide-react';
import { Input, Button } from './UI';

interface LandingPageProps {
  onSubmit: (username: string) => void;
  isLoading: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSubmit, isLoading }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a valid username');
      return;
    }
    // Simple regex for instagram username validation
    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      setError('Username can only contain letters, numbers, periods, and underscores');
      return;
    }
    setError('');
    onSubmit(username);
  };

  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-xl px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-dark border border-gray-800 mb-6 shadow-xl">
            <BarChart2 className="w-8 h-8 text-brand-yellow" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Insta<span className="text-brand-yellow">lytics</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Unlock professional insights for any public Instagram profile.
            Analyze engagement, trends, and content performance in seconds.
          </p>
        </div>

        <div className="bg-brand-dark/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                placeholder="Enter Instagram username (e.g. nike)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-12 text-lg h-14"
                error={error}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold"
              isLoading={isLoading}
            >
              Analyze Profile <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-brand-yellow mr-2"></div>
              Real-time Data
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-brand-yellow mr-2"></div>
              Engagement Metrics
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-brand-yellow mr-2"></div>
              Growth Trends
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-8 text-sm">
          Powered by N8N Automation & Official Instagram Graph API
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
