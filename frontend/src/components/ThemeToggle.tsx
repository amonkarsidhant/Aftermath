import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
