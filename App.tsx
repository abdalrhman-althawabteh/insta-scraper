import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { fetchInstagramData } from './services/api';
import { InstagramData } from './types';
import { LoadingSpinner } from './components/UI';
import { AlertCircle } from 'lucide-react';

type ViewState = 'landing' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InstagramData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (username: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchInstagramData(username);
      
      if (response.success && response.data) {
        setData(response.data);
        setView('dashboard');
      } else {
        setError(response.error || "Failed to fetch data. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setView('landing');
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen font-sans text-white bg-brand-black">
      {/* Global Error Toast */}
      {error && view === 'landing' && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 z-50 backdrop-blur-md">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {loading && view === 'landing' ? (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-brand-black">
           <LoadingSpinner size={12} />
        </div>
      ) : view === 'landing' ? (
        <LandingPage onSubmit={handleSearch} isLoading={loading} />
      ) : data ? (
        <Dashboard data={data} onBack={handleBack} />
      ) : (
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
            <p className="text-gray-400">Something went wrong. No data available.</p>
            <button 
              onClick={handleBack}
              className="text-brand-yellow hover:underline"
            >
              Return Home
            </button>
        </div>
      )}
    </div>
  );
};

export default App;
