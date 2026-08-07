/** Animated first-paint screen that prevents a white flash while the app initialises. */
import { Loader } from '../components/Loader.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export function SplashScreen() {
  const { theme, toggleTheme } = useTheme();
  return <main className="splash"><div className="splash__particles" aria-hidden="true"><i /><i /><i /><i /><i /></div><button className="icon-button splash__theme" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? '◐' : '☼'}</button><section className="splash__panel" aria-label="Doctor Inquiry"><div className="splash__orb"><svg className="splash__icon" viewBox="0 0 56 56" fill="none" aria-hidden="true"><path d="M28 12v32M12 28h32" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/><circle cx="28" cy="28" r="25" stroke="currentColor" strokeOpacity=".24" strokeWidth="2"/></svg></div><h1>Doctor Inquiry</h1><p>Thoughtful care starts with the right information.</p><div className="splash__loading"><Loader label="Preparing Doctor Inquiry" /> Preparing your experience</div><div className="splash__progress" aria-hidden="true"><span /></div></section></main>;
}
