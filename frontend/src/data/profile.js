export const defaultProfile = {
  fullName: 'Aarav Mehta',
  mobile: '+91 98765 43210',
  email: 'aarav.mehta@example.com',
  gender: 'Male',
  dateOfBirth: '12 August 1994',
  bloodGroup: 'B+',
  photo: 'AM',
};

const PROFILE_STORAGE_KEY = 'doctor-inquiry-profile';
const SETTINGS_STORAGE_KEY = 'doctor-inquiry-settings';

export function getProfile() {
  try {
    return { ...defaultProfile, ...JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || '{}') };
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function getSettings() {
  try {
    return { language: 'English', notifications: true, ...JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}') };
  } catch {
    return { language: 'English', notifications: true };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
