const API_LOADING_EVENT = 'doctor-inquiry:api-loading';

export function emitApiLoading(isLoading) {
  window.dispatchEvent(new CustomEvent(API_LOADING_EVENT, { detail: { isLoading } }));
}

export function subscribeToApiLoading(listener) {
  const handleLoading = (event) => listener(event.detail.isLoading);
  window.addEventListener(API_LOADING_EVENT, handleLoading);
  return () => window.removeEventListener(API_LOADING_EVENT, handleLoading);
}
