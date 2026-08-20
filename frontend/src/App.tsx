import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/features/theme/context/ThemeContext';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { WatchlistProvider } from '@/features/watchlist/context/WatchlistContext';
import { Navbar } from '@/components/layout/Navbar';
import { DashboardPage } from '@/pages/DashboardPage';
import { StartupDetailPage } from '@/pages/StartupDetailPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { WatchlistPage } from '@/pages/WatchlistPage';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function App() {
  const [isLive, setIsLive] = useState<boolean>(true);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <WatchlistProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background flex flex-col font-sans text-foreground transition-colors duration-200">
                <Navbar isLive={isLive} />

                <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-8 flex-1">
                  <Routes>
                    <Route
                      path="/"
                      element={<DashboardPage onLiveChange={setIsLive} />}
                    />
                    <Route
                      path="/startups/:id"
                      element={<StartupDetailPage />}
                    />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/watchlist" element={<WatchlistPage />} />
                  </Routes>
                </main>

                <footer className="border-t border-border/40 bg-muted/20 py-6 text-center text-xs text-muted-foreground">
                  <div className="container mx-auto max-w-7xl px-4">
                    StartupRadar Intelligence Platform • SPA Architecture (Vite +
                    React 19 + TypeScript + NestJS 11 + PostgreSQL + OpenAI)
                  </div>
                </footer>

                {/* Système de notifications Toast */}
                <Toaster position="bottom-right" richColors />
              </div>
            </BrowserRouter>
          </WatchlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
