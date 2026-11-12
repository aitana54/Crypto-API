// Middleware for handling authentication and authorization.
// Includes functionality for validating tokens, ensuring protected routes, and managing user roles and permissions to restrict access as needed.

import { Request, Response, NextFunction } from 'express';
import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { TokenHelper } from '../utils/token.helper';
import { AppError } from '../utils/application.error';

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  logger.debug(
    { path: req.path, method: req.method },
    'checkToken middleware: Received authentication request'
  );

  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    logger.warn('checkToken middleware: No token provided');
    next(
      new AppError(
        'You must be logged in to access this resource.',
        httpStatus.UNAUTHORIZED
      )
    );
    return;
  }
  try {
    const decoded = TokenHelper.verifyToken(token);
    (req as any).user = decoded;
    logger.info('checkToken middleware: Token verified successfully');
    next();
    return;
  } catch (error: unknown) {
    logger.warn(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      'checkToken middleware: Invalid token'
    );
    next(new AppError('Invalid token.', httpStatus.UNAUTHORIZED));
  }
};