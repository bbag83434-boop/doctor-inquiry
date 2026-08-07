import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export function HomePlaceholder() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return <main className="auth-page">
    <button className="icon-button auth-page__theme" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
      {theme === 'light' ? '◐' : '☼'}
    </button>
    <section className="auth-panel auth-panel--home" aria-labelledby="home-title">
      <div className="auth-panel__brand"><span className="auth-panel__mark" aria-hidden="true">+</span><span>Doctor Inquiry</span></div>
      <span className="auth-panel__eyebrow">Signed in successfully</span>
      <h1 id="home-title">Welcome, {user?.name || 'Patient'}.</h1>
      <p>This temporary protected home confirms Phase 3 authentication is working. The full home experience belongs to a later phase.</p>
      <Button fullWidth type="button" variant="ghost" onClick={handleLogout}>Log out</Button>
    </section>
  </main>;
}
