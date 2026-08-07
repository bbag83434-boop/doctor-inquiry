import { useTheme } from '../context/ThemeContext.jsx';

export function DashboardHeader({ name }) {
  const { theme, toggleTheme } = useTheme();
  const firstName = name?.trim().split(' ')[0] || 'Patient';
  return <header className="dashboard-header"><div><p className="dashboard-header__eyebrow">Good morning</p><h1>Hello, {firstName}<span aria-hidden="true"> ✦</span></h1><p className="dashboard-header__subtext">Let&apos;s take care of your health today.</p></div><button className="dashboard-theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}><span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span></button></header>;
}
