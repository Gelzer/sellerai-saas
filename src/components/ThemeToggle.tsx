import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  toggle: () => void;
}

export function ThemeToggle({ theme, toggle }: ThemeToggleProps) {
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative h-10 w-10 rounded-full border border-brand-200/50 bg-white/60 p-2 text-brand-700 shadow-sm transition-all duration-300 hover:scale-105 hover:border-brand-400 hover:shadow-md dark:border-brand-700/50 dark:bg-brand-950/60 dark:text-brand-300 dark:hover:border-brand-500"
    >
      <div className="relative h-full w-full">
        <Sun
          className={`absolute inset-0 m-auto h-5 w-5 transition-all duration-500 ${
            theme === 'light'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon
          className={`absolute inset-0 m-auto h-5 w-5 transition-all duration-500 ${
            theme === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : 'rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </button>
  );
}
