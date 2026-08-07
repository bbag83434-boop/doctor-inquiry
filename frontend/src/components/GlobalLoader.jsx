/** Full-screen, non-blocking loading feedback used by the application shell. */
import { Loader } from './Loader.jsx';

export function GlobalLoader({ message }) {
  return <div className="global-loader" role="status" aria-live="polite"><div className="global-loader__card"><Loader label={message} /><span>{message}</span></div></div>;
}
