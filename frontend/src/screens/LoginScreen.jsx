import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { Loader } from '../components/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const MOBILE_PATTERN = /^[6-9]\d{9}$/;

export function LoginScreen() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ mobileNumber: '', password: '', rememberMe: true });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const updateValue = (event) => {
    const { name, type, checked, value } = event.target;
    const nextValue = name === 'mobileNumber' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : nextValue }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitError('');
  };

  const validate = () => {
    const nextErrors = {};
    if (!MOBILE_PATTERN.test(values.mobileNumber)) nextErrors.mobileNumber = 'Enter a valid 10-digit Indian mobile number.';
    if (values.password.length < 6) nextErrors.password = 'Password must contain at least 6 characters.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(values);
      navigate(location.state?.from?.pathname || '/home', { replace: true });
    } catch {
      setSubmitError('We could not sign you in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return <main className="auth-page">
    <button className="icon-button auth-page__theme" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
      {theme === 'light' ? '◐' : '☼'}
    </button>
    <section className="auth-panel" aria-labelledby="login-title">
      <div className="auth-panel__brand" aria-label="Doctor Inquiry">
        <span className="auth-panel__mark" aria-hidden="true">+</span>
        <span>Doctor Inquiry</span>
      </div>
      <div className="auth-panel__intro">
        <span className="auth-panel__eyebrow">Welcome back</span>
        <h1 id="login-title">Your care, all in one place.</h1>
        <p>Sign in to continue your health journey with confidence.</p>
      </div>

      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="mobileNumber">Mobile number</label>
          <div className={`auth-phone ${errors.mobileNumber ? 'auth-phone--error' : ''}`}>
            <span aria-hidden="true">+91</span>
            <input id="mobileNumber" name="mobileNumber" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210" value={values.mobileNumber} onChange={updateValue} aria-invalid={Boolean(errors.mobileNumber)} aria-describedby={errors.mobileNumber ? 'mobileNumber-error' : undefined} />
          </div>
          {errors.mobileNumber && <p className="auth-error" id="mobileNumber-error">{errors.mobileNumber}</p>}
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <div className={`auth-password ${errors.password ? 'auth-password--error' : ''}`}>
            <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={values.password} onChange={updateValue} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} />
            <button className="auth-password__toggle" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={`${showPassword ? 'Hide' : 'Show'} password`}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="auth-error" id="password-error">{errors.password}</p>}
        </div>

        <label className="auth-remember">
          <input name="rememberMe" type="checkbox" checked={values.rememberMe} onChange={updateValue} />
          <span>Remember me on this device</span>
        </label>
        {submitError && <p className="auth-error auth-error--submit" role="alert">{submitError}</p>}
        <Button fullWidth type="submit" disabled={isSubmitting} className="auth-form__submit">
          {isSubmitting ? <><Loader label="Signing in" /> Signing in…</> : 'Sign in securely'}
        </Button>
      </form>
      <p className="auth-panel__note">Demo mode: use any valid 10-digit mobile number and a password of 6 or more characters.</p>
    </section>
  </main>;
}
