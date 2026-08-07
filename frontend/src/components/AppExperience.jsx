/** Coordinates startup, offline recovery, PWA installation and service-worker updates. */
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useGlobalLoading } from '../context/GlobalLoadingContext.jsx';
import { SplashScreen } from '../screens/SplashScreen.jsx';
import { GlobalLoader } from './GlobalLoader.jsx';
import { InstallSheet } from './InstallSheet.jsx';
import { UpdateSheet } from './UpdateSheet.jsx';

const INSTALL_VISITS_KEY = 'doctor-inquiry-visits';
const INSTALL_LATER_KEY = 'doctor-inquiry-install-later';

function isStandalone() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function AppExperience({ children }) {
  const location = useLocation();
  const { isLoading, message } = useGlobalLoading();
  const [showSplash, setShowSplash] = useState(true);
  const [installEvent, setInstallEvent] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const previousPath = useRef(location.pathname);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const { updateServiceWorker } = useRegisterSW({
    onNeedRefresh() { setNeedRefresh(true); },
    onOfflineReady() { setOfflineReady(true); },
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (previousPath.current === location.pathname) return undefined;
    previousPath.current = location.pathname;
    document.documentElement.classList.add('route-changing');
    const timer = window.setTimeout(() => document.documentElement.classList.remove('route-changing'), 260);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const onInstallPrompt = (event) => {
      event.preventDefault();
      if (isStandalone() || localStorage.getItem('doctor-inquiry-installed')) return;
      setInstallEvent(event);
      const visits = Number(localStorage.getItem(INSTALL_VISITS_KEY) || 0) + 1;
      localStorage.setItem(INSTALL_VISITS_KEY, String(visits));
      const laterUntil = Number(localStorage.getItem(INSTALL_LATER_KEY) || 0);
      if (visits >= 3 && Date.now() > laterUntil) setShowInstall(true);
    };
    const onInstalled = () => {
      localStorage.setItem('doctor-inquiry-installed', 'true');
      setShowInstall(false);
      setInstallEvent(null);
    };
    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  useEffect(() => {
    const reconnect = () => {
      setIsConnecting(true);
      let attempts = 0;
      const tryConnection = async () => {
        try {
          const response = await fetch('/api/health', { cache: 'no-store' });
          if (!response.ok) throw new Error('Server unavailable');
          setIsConnecting(false);
        } catch {
          attempts += 1;
          if (attempts < 5 && navigator.onLine) window.setTimeout(tryConnection, Math.min(12000, attempts * 2000));
          else setIsConnecting(false);
        }
      };
      tryConnection();
    };
    const disconnect = () => setIsConnecting(false);
    window.addEventListener('online', reconnect);
    window.addEventListener('offline', disconnect);
    return () => {
      window.removeEventListener('online', reconnect);
      window.removeEventListener('offline', disconnect);
    };
  }, []);

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const result = await installEvent.userChoice;
    if (result.outcome === 'accepted') localStorage.setItem('doctor-inquiry-installed', 'true');
    setShowInstall(false);
    setInstallEvent(null);
  };
  const later = () => {
    localStorage.setItem(INSTALL_LATER_KEY, String(Date.now() + 1000 * 60 * 60 * 24 * 3));
    setShowInstall(false);
  };

  if (showSplash) return <SplashScreen />;
  return <>
    <div className="app-transition">{children}</div>
    {isLoading && <GlobalLoader message={message} />}
    {isConnecting && <GlobalLoader message="Connecting to server..." />}
    {showInstall && installEvent && <InstallSheet onInstall={install} onLater={later} />}
    {needRefresh && <UpdateSheet onUpdate={() => updateServiceWorker(true)} onLater={() => setNeedRefresh(false)} />}
    {offlineReady && <span className="sr-only" role="status">Doctor Inquiry is ready to use offline.</span>}
  </>;
}
