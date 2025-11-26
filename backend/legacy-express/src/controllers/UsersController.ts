import { Request, Response } from 'express';
import { UsersService } from '../../src/services/UsersService';
import { createUserSchema } from '../../src/schemas/users';

export class UsersController {
  constructor(private usersService: UsersService) {}

  async create(request: Request, response: Response) {
    const data = createUserSchema.parse(request.body);
    const user = await this.usersService.create(data);
    return response.status(201).json(user);
  }
}
