import { errorResponse } from '../services/apiResponse.js';

export class ApiError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFoundHandler(req, _res, next) {
  next(new ApiError(`Route ${req.method} ${req.originalUrl} was not found.`, 404));
}

export function errorHandler(error, _req, res, _next) {
  void _next;
  const statusCode = error.statusCode ?? 500;
  const isOperational = error instanceof ApiError;

  if (!isOperational) console.error(error);

  res.status(statusCode).json(errorResponse({
    message: isOperational ? error.message : 'Internal Server Error',
    details: error.details,
  }));
}
