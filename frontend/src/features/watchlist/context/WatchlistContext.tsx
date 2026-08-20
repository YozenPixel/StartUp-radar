import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface WatchlistContextType {
  watchlistIds: string[];
  isWatchlisted: (id: string) => boolean;
  toggleWatchlist: (id: string, name?: string) => void;
  watchlistCount: number;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const STORAGE_KEY = 'startupradar_watchlist';

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlistIds));
    } catch (e) {
      console.error('Impossible de sauvegarder la watchlist dans le localStorage', e);
    }
  }, [watchlistIds]);

  const isWatchlisted = (id: string) => watchlistIds.includes(id);

  const toggleWatchlist = (id: string, name?: string) => {
    setWatchlistIds((prev) => {
      if (prev.includes(id)) {
        toast.info(name ? `"${name}" retirée de votre watchlist.` : 'Startup retirée de votre watchlist.');
        return prev.filter((item) => item !== id);
      } else {
        toast.success(name ? `"${name}" ajoutée à votre watchlist !` : 'Startup ajoutée à votre watchlist !');
        return [...prev, id];
      }
    });
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlistIds,
        isWatchlisted,
        toggleWatchlist,
        watchlistCount: watchlistIds.length,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist doit être utilisé à l\'intérieur d\'un WatchlistProvider');
  }
  return context;
}
