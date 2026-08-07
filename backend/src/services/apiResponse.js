export function successResponse(data, meta) {
  return { success: true, data, ...(meta ? { meta } : {}) };
}

export function errorResponse({ message, details }) {
  return {
    success: false,
    error: { message, ...(details ? { details } : {}) },
  };
}
