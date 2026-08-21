import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  fetchCloudWatchlist,
  addToCloudWatchlist,
  removeFromCloudWatchlist,
} from '@/lib/api';

interface WatchlistContextType {
  watchlistIds: string[];
  isWatchlisted: (id: string) => boolean;
  toggleWatchlist: (id: string, name?: string) => void;
  watchlistCount: number;
  isCloudSynced: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const STORAGE_KEY = 'startupradar_watchlist';

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Synchronisation Cloud au login
  useEffect(() => {
    if (isAuthenticated) {
      fetchCloudWatchlist()
        .then((cloudItems) => {
          const cloudIds = cloudItems.map((item) => item.id);
          // Fusionner avec le local
          const merged = Array.from(new Set([...watchlistIds, ...cloudIds]));
          setWatchlistIds(merged);
          setIsCloudSynced(true);
        })
        .catch(() => {
          setIsCloudSynced(false);
        });
    } else {
      setIsCloudSynced(false);
    }
  }, [isAuthenticated]);

  // Persistance Locale
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlistIds));
    } catch (e) {
      console.error('Impossible de sauvegarder la watchlist dans le localStorage', e);
    }
  }, [watchlistIds]);

  const isWatchlisted = (id: string) => watchlistIds.includes(id);

  const toggleWatchlist = async (id: string, name?: string) => {
    const isCurrentlySaved = watchlistIds.includes(id);

    if (isCurrentlySaved) {
      setWatchlistIds((prev) => prev.filter((item) => item !== id));
      toast.info(name ? `"${name}" retirée de votre watchlist.` : 'Startup retirée de votre watchlist.');

      if (isAuthenticated) {
        removeFromCloudWatchlist(id).catch((err) => {
          console.warn('Erreur lors de la suppression cloud de la watchlist:', err);
        });
      }
    } else {
      setWatchlistIds((prev) => [...prev, id]);
      toast.success(name ? `"${name}" ajoutée à votre watchlist !` : 'Startup ajoutée à votre watchlist !');

      if (isAuthenticated) {
        addToCloudWatchlist(id).catch((err) => {
          console.warn('Erreur lors de l\'ajout cloud à la watchlist:', err);
        });
      }
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlistIds,
        isWatchlisted,
        toggleWatchlist,
        watchlistCount: watchlistIds.length,
        isCloudSynced,
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
