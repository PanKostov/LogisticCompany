import { AbstractError } from './AbstractError';

export class ValidationError extends AbstractError {
  constructor(
    message: string,
    meta?: {
      context?: {};
      args?: any;
      severity?: number;
      status?: number;
      id?: string;
    },
  ) {
    super('ValidationError', message, {
      severity: 1,
      status: !!meta ? meta.status : 400,
      ...meta,
    });
  }
}
