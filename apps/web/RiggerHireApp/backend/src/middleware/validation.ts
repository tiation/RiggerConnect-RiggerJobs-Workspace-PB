import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../lib/errors';

interface ValidateSchema {
  params?: AnyZodObject;
  query?: AnyZodObject;
  body?: AnyZodObject;
}

export function validateRequest(schema: ValidateSchema) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
        );
      }
      throw error;
    }
  };
}
