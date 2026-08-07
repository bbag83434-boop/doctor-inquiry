import { useTheme } from '../context/ThemeContext.jsx';
import { BottomNavigation } from './BottomNavigation.jsx';

export function Layout({ children, showNavigation = false }) {
  const { theme, toggleTheme } = useTheme();
  return <div className="app-shell"><header className="app-topbar"><a className="brand" href="/"><span className="brand__mark">+</span>Doctor Inquiry</a><button className="icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? '◐' : '☼'}</button></header><main className="app-shell__content">{children}</main>{showNavigation && <BottomNavigation />}</div>;
}
