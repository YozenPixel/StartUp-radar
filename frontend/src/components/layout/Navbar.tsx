import React from 'react';
import { Broadcast, Sparkle } from '@phosphor-icons/react';

interface NavbarProps {
  isLive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isLive = true }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Broadcast size={22} weight="bold" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-extrabold tracking-tight">StartupRadar</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  <Sparkle size={10} weight="fill" />
                  AI Intelligence
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground">Market Signals & Opportunity Scoring</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground">
            <a href="/" className="text-foreground font-semibold hover:text-foreground transition-colors">
              Tableau de bord
            </a>
            <a href="#startups" className="hover:text-foreground transition-colors">
              Startups & Levées
            </a>
            <a href="#signals" className="hover:text-foreground transition-colors">
              Signaux de croissance
            </a>
            <a href="#reports" className="hover:text-foreground transition-colors">
              Rapports
            </a>
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

          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground border border-border">
              SR
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
