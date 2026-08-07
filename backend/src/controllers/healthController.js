import { successResponse } from '../services/apiResponse.js';

export function getHealth(_req, res) {
  return res.status(200).json(successResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'doctor-inquiry-api',
  }));
}
