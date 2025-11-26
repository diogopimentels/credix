import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const res = exception.getResponse()
      return response.status(status).json({
        status: 'error',
        message: (res as any).message || exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      })
    }

    // Unknown error
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
