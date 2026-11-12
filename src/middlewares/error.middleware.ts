import { type NextFunction, type Request, type Response } from "express";
import logger from "../config/logger";
import { AppError } from '../utils/application.error';
import { httpStatus } from '../config/httpStatusCodes';

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
    logger.error(
        { error: err, path: req.path, method:req.method }, 'An error occurred'
    );

    // Si es un error personalizado (AppError), se utiliza su código de estado y mensaje
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Si no es un error personalizado, se devuelve una respuesta de error genérica
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    error:
      'An unexpected error occurred, please contact the system administrator.',
  });
};