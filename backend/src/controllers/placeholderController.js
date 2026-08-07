import { ApiError } from '../middleware/errorHandler.js';

export function createPlaceholderController(resourceName) {
  return (_req, _res, next) => next(new ApiError(`${resourceName} API is not implemented yet.`, 501));
}
