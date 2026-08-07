const DEMO_DELAY_MS = 750;

/**
 * Temporary client-side API contract for Phase 3.
 * Replace this function with the backend endpoint when the API is available.
 */
export async function loginWithMobile({ mobileNumber, password }) {
  await new Promise((resolve) => window.setTimeout(resolve, DEMO_DELAY_MS));

  if (!mobileNumber || !password) {
    throw new Error('Mobile number and password are required.');
  }

  return {
    token: `demo-token-${Date.now()}`,
    user: {
      id: 'demo-user-001',
      name: 'Demo Patient',
      mobileNumber,
      role: 'patient',
    },
  };
}
