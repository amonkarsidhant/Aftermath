import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // eslint-disable-next-line no-console
  console.error(err);

  if (err instanceof ZodError) {
    res.status(400).json({ message: 'Validation error', errors: err.errors });
    return;
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
};

export default errorHandler;
