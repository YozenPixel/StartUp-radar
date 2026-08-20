import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Broadcast,
  Sparkle,
  BookmarkSimple,
  FileText,
  House,
  SignOut,
  SignIn,
} from '@phosphor-icons/react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useWatchlist } from '@/features/watchlist/context/WatchlistContext';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  isLive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isLive = true }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { watchlistCount } = useWatchlist();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <Broadcast size={22} weight="bold" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-lg font-extrabold tracking-tight">
                    StartupRadar
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    <Sparkle size={10} weight="fill" />
                    AI Intelligence
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Market Signals & Opportunity Scoring
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? 'bg-muted text-foreground font-bold'
                      : 'hover:text-foreground hover:bg-muted/50'
                  }`
                }
              >
                <House size={14} />
                Tableau de bord
              </NavLink>

              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? 'bg-muted text-foreground font-bold'
                      : 'hover:text-foreground hover:bg-muted/50'
                  }`
                }
              >
                <FileText size={14} />
                Rapports de marché
              </NavLink>

              <NavLink
                to="/watchlist"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? 'bg-muted text-foreground font-bold'
                      : 'hover:text-foreground hover:bg-muted/50'
                  }`
                }
              >
                <BookmarkSimple size={14} />
                Watchlist
                {watchlistCount > 0 && (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {watchlistCount}
                  </span>
                )}
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`hidden sm:flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                isLive
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              {isLive ? 'API Backend Connectée' : 'Mode Démo / Hors-ligne'}
            </div>

            {/* Sélecteur de Thème Clair / Sombre */}
            <ThemeToggle />

            {/* Menu Utilisateur / Connexion */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl border border-border bg-card py-1 px-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-[11px]">
                      {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                    </span>
                    <span className="max-w-[100px] truncate">{user.name || user.email}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2.5 py-1.5">
                    <p className="text-xs font-bold text-foreground">{user.name || 'Analyste'}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/watchlist" className="flex items-center gap-2">
                      <BookmarkSimple size={14} />
                      Ma Watchlist ({watchlistCount})
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={logout}>
                    <SignOut size={14} />
                    Se Déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 text-xs h-8 cursor-pointer"
              >
                <SignIn size={14} />
                Connexion
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};
