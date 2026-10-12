import { useTheme } from '../../hooks/useTheme';
import { MoonIcon, SunIcon } from './Icons';

export default function ThemeToggle() {
  const { toggleTheme } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggleTheme} title="Toggle light / dark mode" aria-label="Toggle theme">
      <SunIcon className="ico-sun" />
      <MoonIcon className="ico-moon" />
    </button>
  );
}
