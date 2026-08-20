import React from 'react';
import { Sun, Moon, Desktop } from '@phosphor-icons/react';
import { useTheme } from '@/features/theme/context/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer"
          title="Changer de thème (Clair / Sombre)"
        >
          {resolvedTheme === 'dark' ? (
            <Moon size={18} weight="fill" className="text-indigo-400" />
          ) : (
            <Sun size={18} weight="fill" className="text-amber-500" />
          )}
          <span className="sr-only">Basculer le thème</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun size={14} className="text-amber-500 mr-2" />
          Mode Clair
          {theme === 'light' && <span className="ml-auto text-[10px] font-bold text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon size={14} className="text-indigo-400 mr-2" />
          Mode Sombre
          {theme === 'dark' && <span className="ml-auto text-[10px] font-bold text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Desktop size={14} className="text-muted-foreground mr-2" />
          Thème Système
          {theme === 'system' && <span className="ml-auto text-[10px] font-bold text-primary">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
