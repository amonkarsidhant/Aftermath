import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction): void => {
  res.on('finish', () => {
    // eslint-disable-next-line no-console
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
};

export default logger;
