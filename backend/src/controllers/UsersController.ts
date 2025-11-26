import { Request, Response } from 'express'
import { UsersService } from '../services/UsersService'
import { createUserSchema } from '../schemas/users'
import { AppError } from '../utils/AppError'

export class UsersController {
  async create(request: Request, response: Response) {
    try {
      const data = createUserSchema.parse(request.body)
      const usersService = new UsersService()
      const user = await usersService.create(data)
      return response.status(201).json({ status: 'success', user })
    } catch (err: any) {
      if (err instanceof AppError) {
        return response.status(err.statusCode || 400).json({ status: 'error', message: err.message })
      }
      if (err?.issues) {
        return response.status(400).json({ status: 'error', message: 'Validation error', issues: err.issues })
      }
      return response.status(500).json({ status: 'error', message: 'Internal server error' })
    }
  }
}
// Legacy Express UsersController moved to `legacy-express` during NestJS migration.
// See: backend/legacy-express/src/controllers/UsersController.ts
export {}
