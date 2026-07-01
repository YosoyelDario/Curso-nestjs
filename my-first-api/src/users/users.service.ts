import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { User } from './user.model';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      name: 'John Wick',
      email: 'john.wick@example.com',
    },
    {
      id: '2',
      name: 'Red John',
      email: 'red.john@example.com',
    },
  ];

  getUserById(id: string) {
    const position = this.findOne(id);
    const user = this.users[position];
    if (user.id === '1') {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este usuario.',
      );
    }
    return this.users[position];
  }

  findALL() {
    return this.users;
  }

  create(body: CreateUserDto) {
    const newUser = {
      ...body,
      id: `${new Date().getTime()}`,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, changes: UpdateUserDto) {
    const position = this.findOne(id);
    const currentData = this.users[position];
    const updatedUser = {
      ...currentData,
      ...changes,
    };
    this.users[position] = updatedUser;
    return updatedUser;
  }

  delete(id: string) {
    const position = this.findOne(id);
    this.users.splice(position, 1);
    return {
      message: 'Usuario eliminado.',
    };
  }

  private findOne(id: string) {
    const position = this.users.findIndex((user) => user.id === id);
    if (position === -1) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return position;
  }
}
