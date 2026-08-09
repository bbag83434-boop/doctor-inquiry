import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button.jsx';
import { Loader } from '../components/Loader.jsx';
import { authenticationService } from '../services/authenticationService.js';
import { useGlobalLoading } from '../context/GlobalLoadingContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const MOBILE_PATTERN = /^[6-9]\d{9}$/;

export function RegisterScreen() {
  const navigate = useNavigate();
  const { beginLoading } = useGlobalLoading();
  const { theme, toggleTheme } = useTheme();
  const [values, setValues] = useState({ fullName: '', mobileNumber: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const updateValue = (event) => {
    const { name, value } = event.target;
    const nextValue = name === 'mobileNumber' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setValues((current) => ({ ...current, [name]: nextValue }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitError('');
  };

  const validate = () => {
    const nextErrors = {};
    if (values.fullName.length < 2) nextErrors.fullName = 'Full name must be at least 2 characters.';
    if (!MOBILE_PATTERN.test(values.mobileNumber)) nextErrors.mobileNumber = 'Enter a valid 10-digit Indian mobile number.';
    if (values.password.length < 8 || !/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
        nextErrors.password = 'Password must be at least 8 characters and include a letter and a number.';
    }
    if (values.password !== values.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const finishLoading = beginLoading('Creating your account...');
    try {
      await authenticationService.register({ fullName: values.fullName, mobileNumber: values.mobileNumber, password: values.password });
      alert('Registration successful! Please sign in.');
      navigate('/login');
    } catch (error) {
      setSubmitError(error.message || 'We could not create your account. Please try again.');
    } finally {
      finishLoading();
      setIsSubmitting(false);
    }
  };

  return <main className="auth-page">
    <button className="icon-button auth-page__theme" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
      {theme === 'light' ? '◐' : '☼'}
    </button>
    <section className="auth-panel" aria-labelledby="register-title">
      <div className="auth-panel__brand" aria-label="Doctor Inquiry">
        <span className="auth-panel__mark" aria-hidden="true">+</span>
        <span>Doctor Inquiry</span>
      </div>
      <div className="auth-panel__intro">
        <h1 id="register-title">Create account</h1>
        <p>Join us to manage your health journey with confidence.</p>
      </div>

      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" name="fullName" type="text" placeholder="Enter your full name" value={values.fullName} onChange={updateValue} aria-invalid={Boolean(errors.fullName)} />
          {errors.fullName && <p className="auth-error">{errors.fullName}</p>}
        </div>

        <div className="auth-field">
          <label htmlFor="mobileNumber">Mobile number</label>
          <div className={`auth-phone ${errors.mobileNumber ? 'auth-phone--error' : ''}`}>
            <span aria-hidden="true">+91</span>
            <input id="mobileNumber" name="mobileNumber" type="tel" inputMode="numeric" placeholder="98765 43210" value={values.mobileNumber} onChange={updateValue} />
          </div>
          {errors.mobileNumber && <p className="auth-error">{errors.mobileNumber}</p>}
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Min 8 chars, 1 letter, 1 number" value={values.password} onChange={updateValue} />
          {errors.password && <p className="auth-error">{errors.password}</p>}
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter your password" value={values.confirmPassword} onChange={updateValue} />
          {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword}</p>}
        </div>

        {submitError && <p className="auth-error auth-error--submit" role="alert">{submitError}</p>}
        <Button fullWidth type="submit" disabled={isSubmitting} className="auth-form__submit">
          {isSubmitting ? <><Loader label="Creating account" /> Creating account…</> : 'Create account'}
        </Button>
      </form>
      <p className="auth-panel__note">Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Sign in</a></p>
    </section>
  </main>;
}
