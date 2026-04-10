import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error('Unhandled internal exception:', exception);
    }

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : typeof exceptionResponse === 'object' &&
            exceptionResponse !== null &&
            'message' in exceptionResponse
          ? (exceptionResponse as Record<string, unknown>).message
          : 'Erro interno do servidor';

    const error =
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'error' in exceptionResponse
        ? (exceptionResponse as Record<string, unknown>).error
        : HttpStatus[status] ?? 'Internal Server Error';

    response.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
