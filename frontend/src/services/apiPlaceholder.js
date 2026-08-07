export function apiNotAvailable(serviceName) {
  return Promise.reject(new Error(`${serviceName} service is prepared but not connected in Phase 10.`));
}
