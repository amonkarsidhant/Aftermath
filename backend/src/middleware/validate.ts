import { AnyZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

const validate = (
  schema: AnyZodObject,
  property: 'body' | 'params' | 'query' = 'body'
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req[property]);
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validate;
